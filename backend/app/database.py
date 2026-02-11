from supabase import create_client

url = "https://YOUR_PROJECT.supabase.co"
key = "YOUR_SUPABASE_KEY"
supabase = create_client(url, key)

def get_user_data(user_id):
    return supabase.table("users").select("*").eq("id", user_id).execute()
