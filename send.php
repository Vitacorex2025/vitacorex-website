
<?php
$name=$_POST['name'];
$company=$_POST['company'];
$email=$_POST['email'];
$revenue=$_POST['revenue'];
$message=$_POST['message'];

$to="VitaCoreXllc@gmail.com";
$subject="VitaCoreX Consultation Request";

$body="Name: $name
Company: $company
Email: $email
Revenue: $revenue
Message: $message";

$headers="From: website@vitacorexllc.com";

mail($to,$subject,$body,$headers);

header("Location: thankyou.html");
?>
