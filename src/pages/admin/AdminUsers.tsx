import { useState, useEffect } from "react";
import { Search, UserCog, Shield, ShieldOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  meter_number: string | null;
  created_at: string;
  isAdmin?: boolean;
}

const AdminUsers = () => {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data: profilesData, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Check admin status for each user
        const profilesWithRoles = await Promise.all(
          (profilesData || []).map(async (profile) => {
            const { data: isAdmin } = await supabase.rpc("has_role", {
              _user_id: profile.user_id,
              _role: "admin",
            });
            return { ...profile, isAdmin: isAdmin === true };
          })
        );

        setProfiles(profilesWithRoles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const toggleAdminRole = async (userId: string, currentlyAdmin: boolean) => {
    try {
      if (currentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");

        if (error) throw error;
        toast.success("Admin role removed");
      } else {
        // Add admin role
        const { error } = await supabase.from("user_roles").insert({
          user_id: userId,
          role: "admin",
        });

        if (error) throw error;
        toast.success("Admin role granted");
      }

      // Update local state
      setProfiles((prev) =>
        prev.map((p) =>
          p.user_id === userId ? { ...p, isAdmin: !currentlyAdmin } : p
        )
      );
    } catch (error) {
      console.error("Error toggling admin role:", error);
      toast.error("Failed to update role");
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const searchLower = search.toLowerCase();
    return (
      profile.full_name?.toLowerCase().includes(searchLower) ||
      profile.meter_number?.toLowerCase().includes(searchLower) ||
      profile.phone?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="w-7 h-7 text-primary" />
          {t("userManagement")}
        </h1>
        <p className="text-muted-foreground">Manage all registered users</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>{t("totalUsers")}: {profiles.length}</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("fullName")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("meterNumber")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{profile.phone || "N/A"}</TableCell>
                    <TableCell>{profile.meter_number || "N/A"}</TableCell>
                    <TableCell>
                      {profile.isAdmin ? (
                        <Badge className="bg-primary">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleAdminRole(profile.user_id, profile.isAdmin || false)
                        }
                        className="flex items-center gap-1"
                      >
                        {profile.isAdmin ? (
                          <>
                            <ShieldOff className="w-4 h-4" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            Make Admin
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProfiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
