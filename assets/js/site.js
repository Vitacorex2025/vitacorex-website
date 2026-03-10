
function buildIntakeMailto(form){
  const fd = new FormData(form);

  const fullName = (fd.get('full_name') || fd.get('name') || '').toString();
  const phone = (fd.get('phone') || '').toString();
  const email = (fd.get('email') || '').toString();
  const location = (fd.get('location') || fd.get('state_city_zip') || '').toString();
  const urgency = (fd.get('urgency') || '').toString();
  const serviceType = (fd.get('service_type') || '').toString();
  const message = (fd.get('message') || '').toString();

  const subject = "VitaCoreX Intake Request - " + (fullName || "New Client");

  const body =
`New intake request

Full Name: ${fullName}
Phone: ${phone}
Email: ${email}
State / City / ZIP Code: ${location}
Urgency: ${urgency}
Service Type: ${serviceType}

Message / Situation Summary:
${message || "-"}`;

  return "mailto:VitaCoreXllc@gmail.com?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body);
}

function bindIntakeForm(form){
  if(!form) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();

    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }

    const mailtoUrl = buildIntakeMailto(form);

    setTimeout(function(){
      window.location.href = mailtoUrl;
    }, 100);
  });
}

document.addEventListener("DOMContentLoaded", function(){
  const form = document.querySelector("form");
  if(form){
    bindIntakeForm(form);
  }
});
