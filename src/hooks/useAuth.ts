
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Profile } from "@/types/content";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true);
      
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user || null);
        
        // Fetch profile if user exists
        if (initialSession?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", initialSession.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else {
            setProfile(profileData);
            setIsAdmin(profileData.role === 'admin');
            setIsInstructor(['admin', 'instructor'].includes(profileData.role));
          }
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    getInitialSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (newSession?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", newSession.user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profileData);
          setIsAdmin(profileData.role === 'admin');
          setIsInstructor(['admin', 'instructor'].includes(profileData.role));
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsInstructor(false);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "로그아웃 되었습니다",
        description: "성공적으로 로그아웃 되었습니다.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "로그아웃 오류",
        description: "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading, 
      isAdmin, 
      isInstructor, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
