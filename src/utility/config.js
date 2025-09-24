const config = {
  apiUrl: "http://localhost:5000/api",
  // apiUrl: "http://bgicqrserver.bgicl.com/api",
  roles: {
    level_1: ["admin"],
    level_2: ["admin", "manager"],
    level_3: ["admin", "manager", "editor"],
    level_4: ["admin", "manager", "editor", "viewer"],
  },
};

export default config;
