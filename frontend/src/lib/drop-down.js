const html = String.raw;

export function DropDown(items) {
  const view = html`
    <div class="drop-down-menu">
      <button class="drop-menu-button" popovertarget="menu-popover">
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6.42C12.2546 6.42 12.4988 6.31886 12.6789 6.13882C12.8589 5.95879 12.96 5.71461 12.96 5.46C12.96 5.20539 12.8589 4.96121 12.6789 4.78118C12.4988 4.60114 12.2546 4.5 12 4.5C11.7454 4.5 11.5013 4.60114 11.3212 4.78118C11.1412 4.96121 11.04 5.20539 11.04 5.46C11.04 5.71461 11.1412 5.95879 11.3212 6.13882C11.5013 6.31886 11.7454 6.42 12 6.42ZM12 13.46C12.2546 13.46 12.4988 13.3589 12.6789 13.1788C12.8589 12.9988 12.96 12.7546 12.96 12.5C12.96 12.2454 12.8589 12.0012 12.6789 11.8212C12.4988 11.6411 12.2546 11.54 12 11.54C11.7454 11.54 11.5013 11.6411 11.3212 11.8212C11.1412 12.0012 11.04 12.2454 11.04 12.5C11.04 12.7546 11.1412 12.9988 11.3212 13.1788C11.5013 13.3589 11.7454 13.46 12 13.46ZM12 20.5C12.2546 20.5 12.4988 20.3989 12.6789 20.2188C12.8589 20.0388 12.96 19.7946 12.96 19.54C12.96 19.2854 12.8589 19.0412 12.6789 18.8612C12.4988 18.6811 12.2546 18.58 12 18.58C11.7454 18.58 11.5013 18.6811 11.3212 18.8612C11.1412 19.0412 11.04 19.2854 11.04 19.54C11.04 19.7946 11.1412 20.0388 11.3212 20.2188C11.5013 20.3989 11.7454 20.5 12 20.5Z"
            stroke="#F8F8F8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div id="menu-popover" popover></div>
      <ul class="menu">
        ${items
          .map(
            (item) =>
              html`<li class="drop-down-menu-items">
                ${item.view || item.title}
              </li>`
          )
          .join("")}
      </ul>
    </div>
  `;

  const Controller = () => {
    const buttons = document.querySelectorAll(".drop-down-menu-items");
    buttons.forEach((button, index) => {
      button.addEventListener("click", (event) => {
        items[index]?.handler();
      });
      button.addEventListener("touchstart", (event) => {
        items[index]?.handler();
      });
    });
  };

  return { view, Controller };
}
