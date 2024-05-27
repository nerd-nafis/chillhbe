document.addEventListener("DOMContentLoaded", function () {
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          const mainContent = document.getElementById("main-content");

          const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
          const currentDate = new Date();
          const currentDay = daysOfWeek[currentDate.getDay()];
          const currentTime = currentDate.getHours() + currentDate.getMinutes() / 60;

          data.friends.forEach(friend => {
              const times = friend[currentDay];
              if (times && times.length > 0) { // Check if the schedule array is not empty
                  let isFree = true;
                  let nextClassTime = null;

                  for (let i = 0; i < times.length; i++) {
                      const startTime = times[i];
                      const endTime = startTime + 1 + 20 / 60; // 1 hour 20 minutes

                      if (currentTime >= startTime && currentTime <= endTime) {
                          isFree = false;
                          break;
                      } else if (currentTime < startTime) {
                          if (!nextClassTime || startTime < nextClassTime) {
                              nextClassTime = startTime;
                          }
                      }
                  }

                  if (isFree) {
                      const card = document.createElement("div");
                      card.className = "card mb-3 border border-white";
                      card.style.maxWidth = "540px";

                      card.innerHTML = `
                          <div class="row g-0">
                              <div class="col-3 d-flex justify-content-center align-items-center">
                                  <img src="./${friend.imageName}" class="img-fluid rounded-pill p-2" alt="...">
                              </div>
                              <div class="col-7">
                                  <div class="card-body">
                                      <h5 class="card-title">${friend.name}</h5>
                                      <p class="card-text">
                                          ${isFree ? `<span id="ifFree" class="text-success">FREE NOW</span>` : ""}
                                          ${nextClassTime ? `<br>Next Class in <code>${Math.round((nextClassTime - currentTime) * 60)} minutes</code>` : "<br>No More Class Today"}
                                      </p>
                                  </div>
                              </div>
                              <div class="col-2 d-flex justify-content-center align-items-center">
                                  <span class="align-middle">
                                      <a href="tel:${friend.contact}">
                                          <i class="bi bi-telephone btn btn-outline-success" style="font-size: 1.2rem;"></i>
                                      </a>
                                  </span>
                              </div>
                          </div>
                      `;

                      mainContent.appendChild(card);
                  }
              }
          });
      })
      .catch(error => console.error('Error fetching data:', error));
});
