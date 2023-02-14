<script>
    import { onMount } from 'svelte'
    import { supabase } from '$lib/supabaseClient'
    // import { goto } from '$app/navigation';
    import Avatar from './Avatar.svelte';
    export let session;
  
    let loading = false
    let username;
    let website;
    let avatarUrl;
  
    onMount(() => {
      getProfile()
    })
  
    const getProfile = async () => {
      try {
        loading = true
        const { user } = session
  
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username, website, avatar_url`)
          .eq('id', user.id)
          .single()
  
        if (data) {
          username = data.username
          website = data.website
          avatarUrl = data.avatar_url
        }
  
        if (error && status !== 406) throw error
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        loading = false
      }
    }
  
    async function updateProfile() {
      try {
        loading = true
        const { user } = session
  
        const updates = {
          id: user.id,
          username: username,
          website: website,
          avatar_url: avatarUrl,
          updated_at: new Date(),
        }
  
        let { error } = await supabase.from('profiles').upsert(updates)
  
        if (error) throw error
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        loading = false
      }
    }
  
    async function signOut() {
      try {
        loading = true
        let { error } = await supabase.auth.signOut()
        if (error) throw error
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        loading = false
      }
    }

    // const GoTodo = async () => {
    //     goto('/todos');
    // }

  </script>

<form use:getProfile class="form-widget" on:submit|preventDefault="{updateProfile}">
  <!-- Add to body -->
  <Avatar bind:url="{avatarUrl}" size="{10}" on:upload="{updateProfile}" />

  <!-- Other form elements -->
</form>
  
  <form class="form-widget" on:submit|preventDefault="{updateProfile}">
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" bind:value="{session.user.email}" disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" bind:value="{username}" />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="website" bind:value="{website}" />
    </div>
  
    <div>
      <input type="submit" class="button block primary" value={loading ? 'Loading...' : 'Update'}
      disabled={loading} />
    </div>
  
    <div>
      <button class="button block" on:click="{signOut}" disabled="{loading}">Sign Out</button>
    </div>

    <!-- <div>
      <button class="button block" on:click={GoTodo} value="Go To TodoList">Go to TodoList</button> -->
  <!-- </div> -->
  </form>