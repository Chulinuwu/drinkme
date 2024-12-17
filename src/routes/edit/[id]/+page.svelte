<script lang="ts">
  import EditSpreadsheet from '../../EditSpreadsheet.svelte';
  export let data: { id: string };

  const spreadsheetId = data.id;
  console.log(spreadsheetId);
</script>

  <EditSpreadsheet {spreadsheetId} />
  
  
