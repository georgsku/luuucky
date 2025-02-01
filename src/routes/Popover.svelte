<script>
    // @ts-nocheck
	import { onMount } from 'svelte';
    let { children, name, applySettingsToStates, applySettingsToForm, getSettingsFromForm } = $props();

    let settingsPopover;

    onMount(() => {
		settingsPopover = document.getElementById('settings-popover');
		const initialSettings = loadSettings();
		applySettingsToForm(initialSettings);
		applySettingsToStates(initialSettings);
	});

    function saveSettings() {
		const settings = getSettingsFromForm();
		saveSettingsToStorage(settings);
		settingsPopover.removeAttribute('popover-open');
	}

	function closePopover() {
		settingsPopover.removeAttribute('popover-open');
	}

    function saveSettingsToStorage(settings) {
		localStorage.setItem(name, JSON.stringify(settings));
	}

    function loadSettings() {
		const savedSettings = JSON.parse(localStorage.getItem(name));
		return savedSettings || {};
	}

</script>

<div popover id="settings-popover" class="rounded-lg bg-white px-8 py-6 border-2 border-gray-900">
    <h3 class="text-xl font-semibold text-gray-900 ">
        Settings
    </h3>
    {@render children?.()}
    <br>
	<div class="flex justify-between items-start mt-4">
        <button type="button" onclick={closePopover} class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 ">Close</button>
        <button type="button" onclick={saveSettings} class="text-main-50 bg-main-700 hover:bg-main-800 focus:ring-4 focus:ring-main-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none shrink-0 ">Save</button>
	</div>
</div>

<style>
    #settings-popover {
        :global(input)  {
            border: 1px solid var(--main-800);
            border-radius: 4px;
            padding: 0 0.25rem;
        }
    }

    #settings-popover::backdrop {
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
    }
</style>