class YogaBook9iBlackout {
	constructor() {
		this.fullMode = true;

		// Disable Window Management API features if not available
		if (!("getScreenDetails") in window) {
			this.polyfill();
		}

		// Bind buttons to enter blackout mode
		[...document.querySelectorAll(".blackout")].forEach(screen => {
			screen.addEventListener("click", event => this.enterBlackout(event.target.closest(".blackout")));
		});

		// Bind global "double tap" to exit blackout mode
		document.addEventListener("dblclick", () => this.exitBlackout());

		// Bind global listener for fullscreen event changes
		document.addEventListener("fullscreenchange", () => this.fullscreenChange());

		// Perform initial fullscreen check on load
		this.fullscreenChange();
	}

	// Compatability "default" mode
	polyfill() {
		// Disable Window Management API features
		if (!("getScreenDetails") in window) {
			window.getScreenDetails = async () => [window.screen];
			window.screen.isExtended = false;
		}		

		// Update UI
		document.querySelector(".mode.full").classList.remove("active");
		document.querySelector(".mode.default").classList.add("active");

		this.fullMode = false;
	}
	
	// Request Winwdow Placement API permissions
	async requestPermission() {
		try {
			// Request window-management permissions
			await getScreenDetails();
			return true;
		} catch {
			// No permission, enter default mode
			this.polyfill();
			return false;
		}
	}

	// Show/hide interface depending on fullscreen state
	fullscreenChange() {
		return document.fullscreenElement
			? document.documentElement.classList.add("blackout")
			: document.documentElement.classList.remove("blackout");
	}

	// Exit blackout mode
	exitBlackout() {
		// Already out of blackout mode
		if (!document.fullscreenElement) {
			return;
		}

		document.exitFullscreen();
	}

	// Enter blackout mode
	async enterBlackout(event) {
		// Window Management API is not supported
		if (!this.fullMode || !await this.requestPermission()) {
			return document.documentElement.requestFullscreen();
		}

		// Available YogaBook 9i screens
		const screens = (await getScreenDetails()).screens.filter((screen) => screen.left === 0);

		// Blackout selected screen by data-screen attribute
		return await document.documentElement.requestFullscreen({ screen: screens[parseInt(event.dataset.screen)] });
	}
}

globalThis._blackout = new YogaBook9iBlackout();