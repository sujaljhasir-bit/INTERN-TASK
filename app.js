const state = {
  items: SCHOLARSHIPS.map((item) => ({ ...item })),
  stateFilter: "All",
  statusFilter: "All",
  editingId: null
};

const el = {
  summary: document.getElementById("summary"),
  rows: document.getElementById("rows"),
  empty: document.getElementById("empty"),
  count: document.getElementById("count"),
  stateTabs: document.getElementById("stateTabs"),
  stateList: document.getElementById("stateList"),
  selectedState: document.getElementById("selectedState"),
  statusFilter: document.getElementById("statusFilter"),
  addBtn: document.getElementById("addBtn"),
  form: document.getElementById("form"),
  formTitle: document.getElementById("formTitle"),
  formDialog: document.getElementById("formDialog"),
  formPreview: document.getElementById("formPreview"),
  previewDialog: document.getElementById("previewDialog"),
  previewBody: document.getElementById("previewBody"),
  toast: document.getElementById("toast")
};

let toastTimer;

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2200);
}

function visibleItems() {
  return state.items.filter((item) => {
    const stateMatch = state.stateFilter === "All" || item.state === state.stateFilter;
    const statusMatch = state.statusFilter === "All" || item.status === state.statusFilter;
    return stateMatch && statusMatch;
  });
}

function renderSummary() {
  const scoped = state.items.filter(
    (item) => state.stateFilter === "All" || item.state === state.stateFilter
  );
  const totals = countByStatus(scoped);
  const cards = [
    { label: "Total Scholarships", value: totals.total, note: "listings" },
    { label: "Published", value: totals.published, note: "visible to students" },
    { label: "Draft", value: totals.draft, note: "not visible yet" },
    { label: "Expired", value: totals.expired, note: "applications closed" }
  ];
  el.summary.innerHTML = cards
    .map(
      (card) => `
      <article class="card">
        <h3 class="card-label">${card.label}</h3>
        <strong class="card-value">${card.value}</strong>
        <span class="card-note">${card.note}</span>
      </article>`
    )
    .join("");
}

function renderStateList() {
  const rows = STATE_NAMES.map((name) => ({
    value: name,
    label: `Total scholarships in ${name}`,
    count: state.items.filter((item) => item.state === name).length
  }));
  rows.push({ value: "All", label: "Total across all states", count: state.items.length });
  el.stateList.innerHTML = rows
    .map(
      (row) => `
      <button type="button" class="list-row${row.value === state.stateFilter ? " active" : ""}" data-state="${row.value}">
        <span>${row.label}</span>
        <strong>${row.count}</strong>
      </button>`
    )
    .join("");
}

function renderTabs() {
  const tabs = ["All", ...STATE_NAMES];
  el.stateTabs.innerHTML = tabs
    .map(
      (name) => `
      <button type="button" role="tab" class="tab${name === state.stateFilter ? " active" : ""}" aria-selected="${name === state.stateFilter}" data-state="${name}">
        ${name === "All" ? "All states" : name}
      </button>`
    )
    .join("");
  el.selectedState.textContent = state.stateFilter === "All" ? "All states" : state.stateFilter;
}

function setStateFilter(value) {
  state.stateFilter = value;
  render();
}

function statusSelect(item) {
  const options = STATUSES.map(
    (status) => `<option${status === item.status ? " selected" : ""}>${status}</option>`
  ).join("");
  return `<select class="status-select status-${item.status.toLowerCase()}" data-action="status" data-id="${item.id}" aria-label="Status for ${escapeHtml(item.name)}">${options}</select>`;
}

function renderRows() {
  const items = visibleItems();
  el.rows.innerHTML = items
    .map(
      (item) => `
      <tr>
        <td data-label="Scholarship" class="name">${escapeHtml(item.name)}</td>
        <td data-label="State">${escapeHtml(item.state)}</td>
        <td data-label="Class">${escapeHtml(item.classRange)}</td>
        <td data-label="Deadline">${formatDeadline(item.deadline)}</td>
        <td data-label="Status">${statusSelect(item)}</td>
        <td data-label="Actions" class="actions">
          <button type="button" class="btn btn-small" data-action="edit" data-id="${item.id}">Edit</button>
          <button type="button" class="btn btn-small" data-action="preview" data-id="${item.id}">Preview</button>
        </td>
      </tr>`
    )
    .join("");
  el.empty.hidden = items.length > 0;
  el.count.textContent = `Showing ${items.length} of ${state.items.length}`;
}

function render() {
  renderSummary();
  renderStateList();
  renderTabs();
  renderRows();
}

function findItem(id) {
  return state.items.find((item) => item.id === Number(id));
}

function previewMarkup(item) {
  const link = item.link
    ? `<a class="btn btn-primary apply" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">Apply now</a>`
    : `<span class="no-link">Application link not available yet</span>`;
  const closed = item.status === "Expired" ? `<p class="closed">Applications are closed.</p>` : "";
  const draftNote =
    item.status === "Draft" ? `<p class="draft-note">Draft: students cannot see this scholarship yet.</p>` : "";
  return `
    <article class="student-card">
      <div class="student-banner" role="img" aria-label="Student studying at a desk"></div>
      <div class="student-body">
      <div class="student-top">
        <span class="chip">${escapeHtml(item.state)}</span>
        <span class="chip chip-class">${escapeHtml(item.classRange)}</span>
      </div>
      <h3>${escapeHtml(item.name)}</h3>
      <p class="provider">${escapeHtml(item.provider)}</p>
      <dl>
        <dt>Benefit</dt><dd>${escapeHtml(item.benefit)}</dd>
        <dt>Eligibility</dt><dd>${escapeHtml(item.eligibility)}</dd>
        <dt>Last date</dt><dd>${formatDeadline(item.deadline)}</dd>
      </dl>
      ${closed}
      ${draftNote}
      ${link}
      </div>
    </article>`;
}

function openPreview(item) {
  el.previewBody.innerHTML = previewMarkup(item);
  if (!el.previewDialog.open) el.previewDialog.showModal();
}

function clearErrors() {
  el.form.querySelectorAll("[data-error]").forEach((node) => {
    node.textContent = "";
  });
  el.form.querySelectorAll(".invalid").forEach((node) => node.classList.remove("invalid"));
}

function showErrors(errors) {
  clearErrors();
  Object.entries(errors).forEach(([field, message]) => {
    const slot = el.form.querySelector(`[data-error="${field}"]`);
    const input = el.form.elements[field];
    if (slot) slot.textContent = message;
    if (input) input.classList.add("invalid");
  });
  const first = Object.keys(errors)[0];
  if (first) el.form.elements[first].focus();
}

function readForm() {
  const data = new FormData(el.form);
  return {
    name: data.get("name"),
    state: data.get("state"),
    provider: data.get("provider"),
    classRange: data.get("classRange"),
    eligibility: data.get("eligibility"),
    benefit: data.get("benefit"),
    deadline: data.get("deadline"),
    link: data.get("link"),
    status: data.get("status")
  };
}

function normalise(values) {
  return {
    name: values.name.trim(),
    state: values.state,
    provider: values.provider.trim(),
    classRange: values.classRange.trim(),
    eligibility: values.eligibility.trim() || NOT_SPECIFIED,
    benefit: values.benefit.trim() || NOT_SPECIFIED,
    deadline: values.deadline,
    link: values.link.trim(),
    status: values.status
  };
}

function openForm(item) {
  clearErrors();
  el.form.reset();
  state.editingId = item ? item.id : null;
  el.formTitle.textContent = item ? "Edit Scholarship" : "Add Scholarship";
  if (item) {
    Object.keys(readForm()).forEach((key) => {
      el.form.elements[key].value = item[key] || "";
    });
  } else if (state.stateFilter !== "All") {
    el.form.elements.state.value = state.stateFilter;
  }
  el.formDialog.showModal();
}

function handleSubmit(event) {
  event.preventDefault();
  const values = readForm();
  const errors = validateScholarship(values);
  if (Object.keys(errors).length) {
    showErrors(errors);
    return;
  }
  const clean = normalise(values);
  if (state.editingId) {
    const item = findItem(state.editingId);
    Object.assign(item, clean);
    showToast("Changes saved");
  } else {
    const nextId = state.items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    state.items.push({ id: nextId, ...clean });
    showToast("Scholarship added");
  }
  el.formDialog.close();
  render();
}

function handleFormPreview() {
  const values = readForm();
  const errors = validateScholarship(values);
  if (Object.keys(errors).length) {
    showErrors(errors);
    return;
  }
  clearErrors();
  openPreview({ id: 0, ...normalise(values) });
}

function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = findItem(button.dataset.id);
  if (button.dataset.action === "edit") openForm(item);
  if (button.dataset.action === "preview") openPreview(item);
}

function handleTableChange(event) {
  const select = event.target.closest("select[data-action='status']");
  if (!select) return;
  const item = findItem(select.dataset.id);
  item.status = select.value;
  render();
  showToast(`Status changed to ${item.status}`);
}

function handleStateClick(event) {
  const target = event.target.closest("[data-state]");
  if (target) setStateFilter(target.dataset.state);
}

el.stateTabs.addEventListener("click", handleStateClick);
el.stateList.addEventListener("click", handleStateClick);

el.statusFilter.addEventListener("change", (event) => {
  state.statusFilter = event.target.value;
  render();
});

el.addBtn.addEventListener("click", () => openForm(null));
el.form.addEventListener("submit", handleSubmit);
el.formPreview.addEventListener("click", handleFormPreview);
el.rows.addEventListener("click", handleTableClick);
el.rows.addEventListener("change", handleTableChange);

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

render();
