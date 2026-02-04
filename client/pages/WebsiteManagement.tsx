import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Plus, Copy, Check, ExternalLink, Loader2, Trash2, Home, Settings, FileText, ArrowLeft } from "lucide-react";

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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

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
    localStorage.setItem("selectedWebsiteTrackingCode", website.trackingCode);
    navigate("/dashboard");
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    setDeleting(websiteId);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/v1/websites/${websiteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete website");
      }

      // Remove from local state
      setWebsites(websites.filter((w) => w.id !== websiteId));
      setDeleteConfirm(null);
      
      // Clear selected website if it was deleted
      if (localStorage.getItem("selectedWebsiteId") === websiteId) {
        localStorage.removeItem("selectedWebsiteId");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete website");
    } finally {
      setDeleting(null);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/documentation">
              <Button variant="ghost" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Docs
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

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
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSelectWebsite(website)}
                            size="sm"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Dashboard
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm(website.id)}
                            size="sm"
                            variant="destructive"
                            disabled={deleting === website.id}
                          >
                            {deleting === website.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {deleteConfirm === website.id && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>
                            <p className="font-semibold mb-2">Are you sure you want to delete this website?</p>
                            <p className="text-sm mb-4">This will permanently delete all analytics data for {website.name}. This action cannot be undone.</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteWebsite(website.id)}
                                disabled={deleting === website.id}
                              >
                                {deleting === website.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  "Yes, Delete"
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting === website.id}
                              >
                                Cancel
                              </Button>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

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
