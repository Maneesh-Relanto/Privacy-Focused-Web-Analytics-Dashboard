import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Plus, Copy, Check, ExternalLink, Loader2 } from "lucide-react";

interface Website {
  id: string;
  name: string;
  domain: string;
  trackingCode: string;
  createdAt: string;
}

export default function WebsiteManagement() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);

  // Fetch websites on mount
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("/api/v1/websites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch websites");
        }

        const data = await response.json();
        setWebsites(data.websites || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load websites");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/v1/websites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          domain: formData.domain,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create website");
      }

      const data = await response.json();
      setWebsites([...websites, data]);
      setFormData({ name: "", domain: "", description: "" });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create website");
    } finally {
      setCreating(false);
    }
  };

  const handleSelectWebsite = (website: Website) => {
    localStorage.setItem("selectedWebsiteId", website.id);
    navigate("/dashboard");
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Manage Websites</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Create and manage your websites to track analytics
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Create Website Button */}
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="mb-6"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Website
              </Button>
            )}

            {/* Create Website Form */}
            {showForm && (
              <Card className="mb-8 border-primary/20">
                <CardHeader>
                  <CardTitle>Create a New Website</CardTitle>
                  <CardDescription>
                    Add a website to start collecting analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateWebsite} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Website Name *
                      </label>
                      <Input
                        placeholder="e.g., My Blog, Company Site"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        disabled={creating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Domain (with https://) *
                      </label>
                      <Input
                        placeholder="e.g., https://myblog.com"
                        value={formData.domain}
                        onChange={(e) =>
                          setFormData({ ...formData, domain: e.target.value })
                        }
                        required
                        disabled={creating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description (optional)
                      </label>
                      <Input
                        placeholder="e.g., My personal tech blog"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        disabled={creating}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={creating}>
                        {creating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Website"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        disabled={creating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Websites List */}
            {websites.length === 0 && !showForm ? (
              <Card className="border-border/50 text-center py-12">
                <CardContent>
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No websites yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first website to start tracking analytics
                  </p>
                  <Button onClick={() => setShowForm(true)} size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Website
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {websites.map((website) => (
                  <Card key={website.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {website.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {website.domain}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => handleSelectWebsite(website)}
                          size="sm"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Dashboard
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Tracking Code
                        </label>
                        <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                          <code className="flex-1 font-mono text-sm break-all">
                            {website.trackingCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(website.trackingCode)
                            }
                          >
                            {copiedCode === website.trackingCode ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Use this code in the tracking script installation
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Created{" "}
                        {new Date(website.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
