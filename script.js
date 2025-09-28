async function getOtp() {
  const res = await fetch("/api/otp");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

async function getNumber() {
  const res = await fetch("/api/number");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

async function getCountries() {
  const res = await fetch("/api/countries");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

async function getCarriers() {
  const res = await fetch("/api/carriers");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}
