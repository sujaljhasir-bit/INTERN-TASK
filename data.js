const NOT_SPECIFIED = "Not specified";

const SCHOLARSHIPS = [
  { id: 1, state: "Bihar", name: "Post-Matric Scholarship BC EBC", classRange: "Class 11-12", deadline: "2026-09-30", status: "Published" },
  { id: 2, state: "Bihar", name: "Post-Matric Scholarship SC ST", classRange: "Class 11-12", deadline: "2026-09-30", status: "Draft" },
  { id: 3, state: "Bihar", name: "Mukhyamantri Balak Balika Protsahan Yojana", classRange: "Class 9-10", deadline: "", status: "Expired" },
  { id: 4, state: "Haryana", name: "Pre-Matric Scholarship for SC Students", classRange: "Class 9-10", deadline: "2026-12-31", status: "Published" },
  { id: 5, state: "Haryana", name: "Pre-Matric Scholarship for BC Students", classRange: "Class 9-10", deadline: "2026-12-31", status: "Draft" },
  { id: 6, state: "Haryana", name: "Post-Matric Scholarship for SC Students", classRange: "Class 11-12", deadline: "2026-12-31", status: "Expired" },
  { id: 7, state: "Jharkhand", name: "Pre-Matric Scholarship for SC Students", classRange: "Class 1-10", deadline: "2026-11-20", status: "Published" },
  { id: 8, state: "Jharkhand", name: "Pre-Matric Scholarship for ST Students", classRange: "Class 1-10", deadline: "2026-11-20", status: "Draft" },
  { id: 9, state: "Jharkhand", name: "Pre-Matric Scholarship for BC OBC Students", classRange: "Class 1-10", deadline: "2026-11-20", status: "Expired" }
].map((item) => ({
  provider: NOT_SPECIFIED,
  eligibility: NOT_SPECIFIED,
  benefit: NOT_SPECIFIED,
  link: "",
  ...item
}));

const STATUSES = ["Published", "Draft", "Expired"];

const STATE_NAMES = ["Bihar", "Haryana", "Jharkhand"];
