windows.onload = () => {
  const token = localStorage.getItem("token")
  if (!token) location.href = "/login"
}
