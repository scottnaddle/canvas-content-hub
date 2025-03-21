
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Admin = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [ltiVersion, setLtiVersion] = useState<"1.1" | "1.3">("1.3");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveLtiSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your LTI configuration has been updated successfully.",
      });
    }, 1500);
  };
  
  const handleTestConnection = () => {
    toast({
      title: "Testing connection...",
      description: "Attempting to connect to Canvas LMS.",
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Connection successful",
        description: "Successfully connected to Canvas LMS.",
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 pt-32">
        <div className="container px-4 mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{t("admin.title")}</h1>
            <p className="text-muted-foreground">Configure your Canvas Hub integration and settings</p>
          </div>
          
          {/* Admin Tabs */}
          <Tabs defaultValue="lti" className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 lg:w-auto">
              <TabsTrigger value="lti">{t("admin.ltiSettings.title")}</TabsTrigger>
              <TabsTrigger value="sso">{t("admin.ssoSettings.title")}</TabsTrigger>
              <TabsTrigger value="users">{t("admin.userManagement.title")}</TabsTrigger>
              <TabsTrigger value="content">{t("admin.contentManagement.title")}</TabsTrigger>
              <TabsTrigger value="system">{t("admin.systemSettings.title")}</TabsTrigger>
            </TabsList>
            
            {/* LTI Settings Tab */}
            <TabsContent value="lti" className="space-y-4 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.ltiSettings.title")}</CardTitle>
                  <CardDescription>
                    {t("admin.ltiSettings.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t("admin.ltiSettings.ltiVersion")}</Label>
                    <RadioGroup
                      defaultValue={ltiVersion}
                      onValueChange={(value) => setLtiVersion(value as "1.1" | "1.3")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1.3" id="lti-1.3" />
                        <Label htmlFor="lti-1.3" className="font-normal">LTI 1.3</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1.1" id="lti-1.1" />
                        <Label htmlFor="lti-1.1" className="font-normal">LTI 1.1</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {ltiVersion === "1.3" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="client-id">{t("admin.ltiSettings.clientId")}</Label>
                        <Input id="client-id" placeholder="e.g., 10000000000001" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="key-set">{t("admin.ltiSettings.keySet")}</Label>
                        <Input id="key-set" placeholder="e.g., https://canvas.example.com/api/lti/security/jwks" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="redirect-url">{t("admin.ltiSettings.redirectUrl")}</Label>
                        <Input id="redirect-url" placeholder="e.g., https://lti.example.com/launch" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="platform-issuer">{t("admin.ltiSettings.platformIssuer")}</Label>
                        <Input id="platform-issuer" placeholder="e.g., https://canvas.instructure.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deployment-id">{t("admin.ltiSettings.deploymentId")}</Label>
                        <Input id="deployment-id" placeholder="e.g., 1" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="consumer-key">Consumer Key</Label>
                        <Input id="consumer-key" placeholder="e.g., lti_consumer_key" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="shared-secret">Shared Secret</Label>
                        <Input id="shared-secret" placeholder="e.g., lti_shared_secret" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="launch-url">Launch URL</Label>
                        <Input id="launch-url" placeholder="e.g., https://lti.example.com/launch" />
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={handleTestConnection}>
                    {t("admin.ltiSettings.testConnection")}
                  </Button>
                  <Button onClick={handleSaveLtiSettings} disabled={isSaving}>
                    {isSaving ? t("common.loading") : t("admin.ltiSettings.saveSettings")}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>LTI Launch Configuration</CardTitle>
                  <CardDescription>
                    Information needed to register this tool in Canvas LMS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="text-sm font-medium mb-2">Tool URL:</h4>
                    <p className="text-sm text-muted-foreground font-mono">https://canvas-hub.example.com/lti/launch</p>
                    
                    <h4 className="text-sm font-medium mt-4 mb-2">Redirect URLs:</h4>
                    <p className="text-sm text-muted-foreground font-mono">https://canvas-hub.example.com/lti/auth</p>
                    
                    <h4 className="text-sm font-medium mt-4 mb-2">JWKS URL:</h4>
                    <p className="text-sm text-muted-foreground font-mono">https://canvas-hub.example.com/lti/keys</p>
                    
                    <h4 className="text-sm font-medium mt-4 mb-2">Target Link URI:</h4>
                    <p className="text-sm text-muted-foreground font-mono">https://canvas-hub.example.com/lti/launch</p>
                  </div>
                  
                  <Button variant="outline" className="w-full" type="button">
                    Copy Launch Configuration
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* SSO Settings Tab */}
            <TabsContent value="sso" className="space-y-4 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.ssoSettings.title")}</CardTitle>
                  <CardDescription>
                    {t("admin.ssoSettings.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sso-provider">{t("admin.ssoSettings.provider")}</Label>
                    <Select defaultValue="openid">
                      <SelectTrigger id="sso-provider">
                        <SelectValue placeholder="Select SSO Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openid">OpenID Connect</SelectItem>
                        <SelectItem value="saml">SAML 2.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sso-client-id">{t("admin.ssoSettings.clientId")}</Label>
                    <Input id="sso-client-id" placeholder="e.g., sso_client_id" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sso-client-secret">{t("admin.ssoSettings.clientSecret")}</Label>
                    <Input id="sso-client-secret" placeholder="e.g., sso_client_secret" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sso-domain">{t("admin.ssoSettings.domain")}</Label>
                    <Input id="sso-domain" placeholder="e.g., sso.example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sso-callback">{t("admin.ssoSettings.callbackUrl")}</Label>
                    <Input id="sso-callback" placeholder="e.g., https://canvas-hub.example.com/auth/callback" readOnly />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">
                    {t("admin.ssoSettings.saveSettings")}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Social Login Settings</CardTitle>
                  <CardDescription>
                    Configure Google and Facebook login options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Google Login</h4>
                    <div className="space-y-2">
                      <Label htmlFor="google-client-id">Client ID</Label>
                      <Input id="google-client-id" placeholder="Google Client ID" />
                    </div>
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="google-client-secret">Client Secret</Label>
                      <Input id="google-client-secret" placeholder="Google Client Secret" type="password" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Facebook Login</h4>
                    <div className="space-y-2">
                      <Label htmlFor="facebook-app-id">App ID</Label>
                      <Input id="facebook-app-id" placeholder="Facebook App ID" />
                    </div>
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="facebook-app-secret">App Secret</Label>
                      <Input id="facebook-app-secret" placeholder="Facebook App Secret" type="password" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">
                    Save Social Login Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Placeholder for other tabs */}
            <TabsContent value="users" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.userManagement.title")}</CardTitle>
                  <CardDescription>
                    Manage users, roles, and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    User management features coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.contentManagement.title")}</CardTitle>
                  <CardDescription>
                    Manage content categories and tags
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Content management features coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.systemSettings.title")}</CardTitle>
                  <CardDescription>
                    Configure system-wide settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    System settings features coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
