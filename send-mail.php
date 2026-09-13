<?php
/**
 * MANAR AL OMRAN - Contact form handler
 * Receives POST from contact-us.html, validates, emails the sales team,
 * and returns a JSON response consumed by js/main.js (initContactForm).
 *
 * Requires PHP mail() to be configured on the hosting account.
 */

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

const RECIPIENT = 'info@manar.com.sa';
const SUBJECT_PREFIX = '[Website Inquiry] ';

function respond(bool $success, string $message, int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

// Honeypot: bots fill hidden fields - pretend success but do nothing.
if (!empty($_POST['website'])) {
    respond(true, 'Thank you! Your inquiry has been submitted.');
}

function field(string $key): string
{
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}

$name    = field('name');
$email   = field('email');
$phone   = field('phone');
$company = field('company');
$service = field('service');
$message = field('message');

$services = [
    'formwork-hire'      => 'Formwork & Scaffolding Hire / Rental',
    'materials-purchase' => 'Formwork & Scaffolding Purchase (Sale)',
    'engineering-design' => 'Structural Engineering & Static Calculations',
    'bim-planning'       => '3D BIM Modeling & Formwork Planning',
    'site-supervision'   => 'On-Site Rigging & Field Technical Support',
    'other-inquiry'      => 'General Corporate / Commercial Inquiry',
];

$errors = [];

if ($name === '' || mb_strlen($name) > 120) {
    $errors[] = 'Please provide your full name.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}
if ($phone === '' || mb_strlen($phone) > 40) {
    $errors[] = 'Please provide a phone number.';
}
if ($company === '' || mb_strlen($company) > 160) {
    $errors[] = 'Please provide your company name.';
}
if ($message === '' || mb_strlen($message) > 5000) {
    $errors[] = 'Please describe your project requirements.';
}

if ($errors) {
    respond(false, implode(' ', $errors), 422);
}

$safeName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeCompany = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
$safePhone   = preg_replace('/[^\d\s\+\-\(\)\.]/', '', $phone);
$safeService = isset($services[$service]) ? $services[$service] : 'Not specified';
$safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$subject = SUBJECT_PREFIX . 'New Project Inquiry from ' . $safeName;

$body = "You have received a new project inquiry from the website contact form.\n\n"
      . "Name:     {$safeName}\n"
      . "Email:    {$email}\n"
      . "Phone:    {$safePhone}\n"
      . "Company:  {$safeCompany}\n"
      . "Service:  {$safeService}\n\n"
      . "Project Details:\n"
      . str_repeat('-', 50) . "\n"
      . $safeMessage . "\n"
      . str_repeat('-', 50) . "\n\n"
      . 'Sent: ' . date('Y-m-d H:i:s') . "\n"
      . 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers = [
    'From: noreply@manar.com.sa',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = @mail(RECIPIENT, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    respond(false, 'The message could not be sent right now. Please email us directly at info@manar.com.sa or call +966 50 451 8066.', 500);
}

respond(true, 'Thank you! Your engineering inquiry has been submitted. Our technical team in Dammam will respond within 24 hours.');
