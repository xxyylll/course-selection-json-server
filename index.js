class Model {
    async getCourses() {
      const response = await fetch("http://localhost:3000/courseList");
      const courses = await response.json();
      return courses;
    }
  }

  class View {
    createCourseElement(courseList, clickHandler) {
      const courseElement = document.createElement("div");
      courseElement.className = "course-item";
      courseElement.innerHTML = `
        <p>Course Name: ${courseList.courseName}</p >
        <p>Course Type: ${courseList.required === true ? "Compulsory" : "Elective"}</p >
        <p>Course Credits: ${courseList.credit}</p >
      `;
      courseElement.addEventListener("click", clickHandler);
      return courseElement;
    }

    updateTotalCredits(totalCredits) {
      const totalCreditsElement = document.getElementById("total-credits");
      totalCreditsElement.textContent = totalCredits;
    }
  }

  class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.selectedCourses = new Set();
      this.totalCredits = 0;
    }

    async init() {
        const courses = await this.model.getCourses();

        const availableCoursesContainer = document.getElementById("available-courses");

        courses.forEach((courseList) => {
        const courseElement = this.view.createCourseElement(courseList, () => {
          this.onCourseClick(courseList, courseElement);
        });
        availableCoursesContainer.appendChild(courseElement);
    });

        const selectButton = document.getElementById("select-button");
        selectButton.addEventListener("click", () => {
        this.onSelectButtonClick();
      });
    }

    onCourseClick(courseList, courseElement) {
        if (this.selectedCourses.has(courseList.courseId)) {
            this.selectedCourses.delete(courseList.courseId);
            this.totalCredits -= courseList.credit;
            courseElement.classList.remove("selected");
      } else {
        if (this.totalCredits + courseList.credit > 18) {
            alert("You can only choose up to 18 credits in one semester.");
            return;
        }
        this.selectedCourses.add(courseList.courseId);
        this.totalCredits += courseList.credit;
        courseElement.classList.add("selected");
    }
    this.view.updateTotalCredits(this.totalCredits);
}
    onSelectButtonClick() {
        const confirmationMessage = `You have chosen ${this.totalCredits} credits for this semester. You cannot change once you submit. Do you want to confirm?`;
        if (confirm(confirmationMessage)) {
            this.moveSelectedCourses();
            const selectButton = document.getElementById("select-button");
            selectButton.disabled = true;
        }
    }
    moveSelectedCourses() {
        const availableCoursesContainer = document.getElementById("available-courses");
        const selectedCoursesContainer = document.getElementById("selected-courses");
        Array.from(availableCoursesContainer.children).forEach((courseElement) => {
            if (this.selectedCourses.has(courseElement.classList.courseId)) {
                selectedCoursesContainer.appendChild(courseElement);
                }
            });
        }
    }
        const model = new Model();
        const view = new View();
        const controller = new Controller(model, view);
        controller.init();
