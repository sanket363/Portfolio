// Example using Fetch API (replace with your GitHub username)
fetch("https://api.github.com/users/sanket363/repos")
  .then((response) => response.json())
  .then((repos) => {
    const projectsContainer = document.getElementById("projects-container");
    repos.forEach((repo) => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project");
      projectElement.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description}</p>
        <ul>
          <li>Language: ${repo.language}</li>
          <li>Stars: ${repo.stargazers_count}</li>
        </ul>
      `;
      projectsContainer.appendChild(projectElement);
    });
  })
  .catch((error) => console.error("Error fetching repositories:", error));
