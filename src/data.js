export const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "people", label: "People" },
  { id: "events", label: "Events" },
  { id: "placements", label: "Placements" },
  { id: "alumni", label: "Alumni" },
  { id: "achievements", label: "Achievements" },
  { id: "logger", label: "Logger" }
];

export const NOTICE = {
  text: "Registrations for HackIT 2026 close on 28 September.",
  href: "#events"
};

export const STATS = [
  { value: "480+", key: "Active members" },
  { value: "32", key: "Events this year" },
  { value: "61", key: "Recruiting companies" },
  { value: "2,400+", key: "Alumni network" }
];

export const QUICK_LINKS = [
  { label: "Upcoming events", href: "#events" },
  { label: "Activity logger", href: "#logger" },
  { label: "Placement records", href: "#placements" },
  { label: "Academic resources", href: "#about" }
];

export const FACULTY = [
  { name: "Dr. S. Ramanathan", role: "Head of Division", initials: "SR" },
  { name: "Dr. Priya Nair", role: "Staff Coordinator, SAIT", initials: "PN" },
  { name: "Dr. Joseph K. Thomas", role: "Faculty, Placement Cell", initials: "JT" },
  { name: "Dr. Lakshmi Iyer", role: "Faculty, Research and Publications", initials: "LI" }
];

export const EXEC = [
  { name: "Aravind Krishnan", role: "President", initials: "AK" },
  { name: "Meenakshi Pillai", role: "Vice President", initials: "MP" },
  { name: "Rohan Varghese", role: "General Secretary", initials: "RV" },
  { name: "Fathima Rasheed", role: "Treasurer", initials: "FR" },
  { name: "Aditya Menon", role: "Joint Secretary", initials: "AM" },
  { name: "Sneha Thomas", role: "Chief Editor", initials: "ST" }
];

export const TEAMS = [
  { name: "Tech", lead: "Nikhil Suresh", members: ["Anand R.", "Divya K.", "Hari P.", "Zoya M."] },
  { name: "Media", lead: "Ishita Balan", members: ["Rahul N.", "Tanvi S.", "Arjun V."] },
  { name: "Events", lead: "Karthik Raj", members: ["Neha J.", "Siddharth M.", "Aparna R.", "Vivek T."] },
  { name: "PR", lead: "Anjali Menon", members: ["Farhan A.", "Gayatri S.", "Nithin K."] },
  { name: "Content", lead: "Riya Sebastian", members: ["Akhil B.", "Manasa P.", "Yash D."] }
];

export const EVENT_CATEGORIES = ["All", "Hackathon", "Workshop", "Talk", "Competition", "Cultural"];

export const UPCOMING_EVENTS = [
  { date: "24 Sep 2026", title: "HackIT 2026 - 24-hour Hackathon", category: "Hackathon", venue: "IT Lab Complex, SOE", time: "09:00", note: "Team of 3-4. Registration closes 28 Sep." },
  { date: "30 Sep 2026", title: "Workshop: Systems Programming in Rust", category: "Workshop", venue: "Seminar Hall, IT Block", time: "14:00", note: "Open to 2nd and 3rd year. 40 seats." },
  { date: "06 Oct 2026", title: "TechTalk: Distributed Systems in Practice", category: "Talk", venue: "Auditorium, SOE", time: "11:00", note: "Speaker from industry. Open to all." },
  { date: "14 Oct 2026", title: "CodeFest - Inter-college Programming Contest", category: "Competition", venue: "Central Computing Facility", time: "09:30", note: "Individual entry. Three rounds." }
];

export const PAST_EVENTS = [
  { date: "Aug 2026", title: "InnoVIT - Project Expo", category: "Competition" },
  { date: "Jul 2026", title: "Workshop: Intro to Kubernetes", category: "Workshop" },
  { date: "Apr 2026", title: "TechTalk: Careers in Product Engineering", category: "Talk" },
  { date: "Mar 2026", title: "HackIT 2025 - Winners Announcement", category: "Hackathon" },
  { date: "Feb 2026", title: "Annual Day and Department Awards", category: "Cultural" },
  { date: "Dec 2025", title: "Workshop: Git and Collaborative Development", category: "Workshop" },
  { date: "Nov 2025", title: "CodeFest 2025", category: "Competition" },
  { date: "Sep 2025", title: "Orientation for First Years", category: "Talk" }
];

export const PLACEMENT_STATS = [
  { value: "94%", key: "Placement rate, 2026 batch" },
  { value: "44 LPA", key: "Highest package" },
  { value: "9.2 LPA", key: "Median package" },
  { value: "61", key: "Recruiters on campus" }
];

export const RECRUITERS = [
  "TCS Digital", "Infosys", "Wipro", "Zoho", "Freshworks",
  "UST Global", "Cognizant", "IBS Software", "Amazon", "Microsoft",
  "Oracle", "SAP Labs", "Nokia", "Quest Global", "Tata Elxsi", "NeST Digital"
];

export const CAREER_RESOURCES = [
  { label: "Placement brochure 2026 (PDF)", href: "#" },
  { label: "Internship policy and guidelines", href: "#" },
  { label: "Resume template - IT Division", href: "#" },
  { label: "Mock interview schedule", href: "#" },
  { label: "Alumni referral directory", href: "#alumni" }
];

export const ALUMNI = [
  { name: "Deepak Nair", year: "2014", role: "Staff Engineer, Google", note: "Works on storage infrastructure." },
  { name: "Reshma Kurup", year: "2016", role: "Product Manager, Freshworks", note: "Leads the CRM platform team." },
  { name: "Joel Mathew", year: "2013", role: "Founder, Kavach Security", note: "Application security startup, Kochi." },
  { name: "Ananya Varma", year: "2018", role: "Research Scientist, IISc", note: "Works on distributed ML systems." },
  { name: "Suresh Babu", year: "2009", role: "Engineering Manager, Amazon", note: "Mentors SAIT placement cell." },
  { name: "Nithya Raghavan", year: "2019", role: "SDE II, Microsoft", note: "Azure networking." }
];

export const ACHIEVEMENTS = [
  { year: "2026", title: "Winners, Smart India Hackathon (Software Edition)", who: "Team of 6, 3rd year IT" },
  { year: "2026", title: "Best Paper, IEEE CONECCT", who: "A. Menon, R. Varghese" },
  { year: "2025", title: "Runner-up, ACM ICPC Regionals - Amritapuri", who: "Team Vector" },
  { year: "2025", title: "First place, Kerala State Hackathon", who: "Team of 4, 2nd year IT" },
  { year: "2025", title: "GATE 2025 - AIR 42 (CS)", who: "S. Thomas" },
  { year: "2024", title: "Published: Springer LNNS, Applied ML track", who: "Final-year project group" }
];

export const ACTIVITY_TYPES = [
  { id: "hackathon", label: "Hackathon", points: 50 },
  { id: "competition", label: "Competition", points: 40 },
  { id: "publication", label: "Publication", points: 35 },
  { id: "internship", label: "Internship", points: 30 },
  { id: "workshop", label: "Workshop", points: 15 },
  { id: "cultural", label: "Cultural", points: 10 },
  { id: "sports", label: "Sports", points: 10 }
];

export const SEED_ACTIVITIES = [
  { id: 1, title: "HackIT 2025 - 1st place", type: "hackathon", date: "12 Mar 2025", role: "Team lead", status: "verified", points: 50, who: "Aravind K." },
  { id: 2, title: "IEEE CONECCT - Best Paper", type: "publication", date: "04 Feb 2026", role: "Co-author", status: "verified", points: 35, who: "Aditya M." },
  { id: 3, title: "Summer Internship - Zoho", type: "internship", date: "01 Jun 2025", role: "Intern, Backend", status: "verified", points: 30, who: "Meenakshi P." },
  { id: 4, title: "Intro to Kubernetes Workshop", type: "workshop", date: "22 Jul 2026", role: "Participant", status: "pending", points: 15, who: "Rohan V." },
  { id: 5, title: "Kerala State Hackathon - 1st place", type: "hackathon", date: "18 Nov 2025", role: "Team member", status: "verified", points: 50, who: "Fathima R." }
];

export const LEADERBOARD = [
  { rank: 1, name: "Aravind Krishnan", points: 340 },
  { rank: 2, name: "Fathima Rasheed", points: 290 },
  { rank: 3, name: "Aditya Menon", points: 265 },
  { rank: 4, name: "Meenakshi Pillai", points: 210 },
  { rank: 5, name: "Rohan Varghese", points: 185 }
];

export const NOTIFICATIONS = [
  { date: "18 Sep 2026", title: "HackIT 2026 - registration closes 28 September", body: "Teams of 3-4. Open to all years. Problem statements will be released on 25 September. Register through the events page." },
  { date: "15 Sep 2026", title: "Activity Logger - submission window for Semester 5", body: "Students in Semester 5 must submit all activities for the current academic year before 30 September for verification by the faculty coordinator." },
  { date: "10 Sep 2026", title: "Placement registration - 2026 batch", body: "Students appearing for campus placements must complete profile registration on the placement portal before 22 September. Contact the placement cell for clarifications." },
  { date: "02 Sep 2026", title: "Call for papers - Department Technical Journal", body: "Submissions are invited from UG and PG students. Last date for full paper submission is 15 October." }
];