import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth(Component: React.ComponentType<any>) {
  return function ProtectedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/auth");
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg)",
          color: "var(--text)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <p>Chargement...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return null; // The useEffect will redirect, so we can return null here
    }

    return <Component {...props} />;
  };
}
