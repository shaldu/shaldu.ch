<script lang="ts">
	import { Button, Tab, TabContent, Tabs, TextArea, TextInput, ToastNotification } from 'carbon-components-svelte';
    import Save from "carbon-icons-svelte/lib/Save.svelte";
	import AlphabetLearner from './AlphabetLearner.svelte';

</script>


<div class="card h-100">
	<div class="card-body h-100">
		<div class="row justify-content-between h-100">
			<div class="col-12">
				<AlphabetLearner type="both" mode="japanese" />
			</div>
		</div>
	</div>
</div>