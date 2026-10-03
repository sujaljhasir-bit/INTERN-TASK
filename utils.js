function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDeadline(iso) {
  if (!iso) return "Not stated";
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function validateScholarship(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter the scholarship name.";
  if (!values.state) errors.state = "Select a state.";
  if (!values.provider.trim()) errors.provider = "Enter the provider name.";
  if (!values.classRange.trim()) errors.classRange = "Enter the applicable class.";
  if (values.link.trim() && !isValidUrl(values.link.trim())) {
    errors.link = "Enter a full link starting with http:// or https://.";
  }
  return errors;
}

function countByStatus(items) {
  return {
    total: items.length,
    published: items.filter((item) => item.status === "Published").length,
    draft: items.filter((item) => item.status === "Draft").length,
    expired: items.filter((item) => item.status === "Expired").length
  };
}
