import { supabase } from "../supabase";

// 🔥 role priority order
const ROLE_ORDER = {
  owner: 1,
  website_admin: 2,
  hotel_manager: 3,
  hr: 4,
  hotel_website_admin: 5,
};

export async function getEmployees() {
  // 1. fetch profiles
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      avatar_url,
      status,
      hotel_id,
      role
    `);

  // 2. fetch roles
  const { data: roles, error: roleError } = await supabase
    .from("roles")
    .select(`
      id,
      name,
      value
    `);

  if (profileError || roleError) {
    console.error(
      "Error fetching employees:",
      profileError || roleError
    );
    return [];
  }

  // 3. role map (value → role object)
  const roleMap = Object.fromEntries(
    roles.map((r) => [r.value, r])
  );

  // 4. enrich data
  const enriched = profiles.map((emp) => {
    // avatar conversion
    let avatarUrl = emp.avatar_url;

    const isAlreadyUrl = avatarUrl?.startsWith("http");

    if (avatarUrl && !isAlreadyUrl) {
      const { data } = supabase
        .storage
        .from("avatars")
        .getPublicUrl(avatarUrl);

      avatarUrl = data.publicUrl;
    }

    return {
      ...emp,
      avatar_url: avatarUrl || null,
      roleData: roleMap[emp.role] || null,
    };
  });

  // 5. final sort (role priority → name)
  return enriched.sort((a, b) => {
    const aRole = a.role;
    const bRole = b.role;

    const aRank = ROLE_ORDER[aRole] ?? 999;
    const bRank = ROLE_ORDER[bRole] ?? 999;

    if (aRank !== bRank) {
      return aRank - bRank;
    }

    return (a.full_name || "").localeCompare(
      b.full_name || ""
    );
  });
}