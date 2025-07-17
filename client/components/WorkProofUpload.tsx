import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Camera,
  Video,
  Upload,
  X,
  Eye,
  Download,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface WorkProof {
  id: string;
  type: "image" | "video" | "document";
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  description: string;
  thumbnail?: string;
}

interface WorkProofUploadProps {
  taskId: string;
  isTasker: boolean;
  isCustomer: boolean;
  canUpload: boolean;
  existingProofs?: WorkProof[];
  onProofUploaded?: (proof: WorkProof) => void;
}

export default function WorkProofUpload({
  taskId,
  isTasker,
  isCustomer,
  canUpload,
  existingProofs = [],
  onProofUploaded,
}: WorkProofUploadProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [proofs, setProofs] = useState<WorkProof[]>(existingProofs);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState<WorkProof | null>(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        addNotification({
          type: "error",
          title: "File Too Large",
          message: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          priority: "medium",
          fromUser: "TaskIt System",
        });
        continue;
      }

      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate file upload with progress
      const uploadPromise = new Promise<string>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            clearInterval(interval);
            setUploadProgress(100);
            resolve(URL.createObjectURL(file));
          } else {
            setUploadProgress(progress);
          }
        }, 200);
      });

      const url = await uploadPromise;

      const newProof: WorkProof = {
        id: Date.now().toString(),
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : "document",
        url,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        description: description || `Work proof: ${file.name}`,
        thumbnail: file.type.startsWith("image/") ? url : undefined,
      };

      setProofs([...proofs, newProof]);
      setDescription("");
      onProofUploaded?.(newProof);

      addNotification({
        type: "success",
        title: "Proof Uploaded",
        message: `${file.name} has been uploaded successfully.`,
        priority: "medium",
        fromUser: "TaskIt System",
        taskId,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Upload Failed",
        message: `Failed to upload ${file.name}. Please try again.`,
        priority: "medium",
        fromUser: "TaskIt System",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeProof = (proofId: string) => {
    setProofs(proofs.filter((p) => p.id !== proofId));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: WorkProof["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Work Proof</span>
          {proofs.length > 0 && (
            <Badge variant="secondary">{proofs.length} files</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Area - Only for Taskers */}
          {isTasker && canUpload && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="proof-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="proof-description"
                  placeholder="Describe the completed work shown in these files..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-3">
                  <div className="flex justify-center space-x-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                    <Video className="w-8 h-8 text-gray-400" />
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Upload photos, videos or documents of completed work
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop or click to browse • Max 10MB per file
                    </p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) =>
                  e.target.files && handleFileSelect(e.target.files)
                }
                className="hidden"
              />

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          )}

          {/* Uploaded Proofs */}
          {proofs.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Uploaded Work Proof</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {proofs.map((proof) => (
                  <div
                    key={proof.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="text-muted-foreground">
                          {getFileIcon(proof.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {proof.filename}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(proof.size)} •{" "}
                            {new Date(proof.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPreview(proof)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {isTasker && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeProof(proof.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {proof.description && (
                      <p className="text-xs text-muted-foreground">
                        {proof.description}
                      </p>
                    )}

                    {proof.thumbnail && (
                      <div className="relative">
                        <img
                          src={proof.thumbnail}
                          alt={proof.filename}
                          className="w-full h-32 object-cover rounded"
                        />
                        {proof.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-2">
                              <Video className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isTasker ? (
                canUpload ? (
                  <>
                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No work proof uploaded yet.</p>
                    <p className="text-sm">
                      Upload photos or videos of your completed work to build
                      trust.
                    </p>
                  </>
                ) : (
                  <>
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Work proof upload available after task completion.</p>
                  </>
                )
              ) : (
                <>
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No work proof available yet.</p>
                  <p className="text-sm">
                    The tasker will upload proof when work is completed.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Customer View - Verification Status */}
          {isCustomer && proofs.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">
                  Work Proof Submitted
                </h4>
              </div>
              <p className="text-sm text-green-700 mt-1">
                The tasker has provided {proofs.length} proof file(s) of
                completed work. Review the files before releasing payment.
              </p>
            </div>
          )}
        </div>

        {/* Preview Dialog */}
        {showPreview && (
          <Dialog
            open={!!showPreview}
            onOpenChange={() => setShowPreview(null)}
          >
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {getFileIcon(showPreview.type)}
                  <span>{showPreview.filename}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {showPreview.type === "image" && (
                  <img
                    src={showPreview.url}
                    alt={showPreview.filename}
                    className="w-full max-h-96 object-contain rounded"
                  />
                )}

                {showPreview.type === "video" && (
                  <video
                    src={showPreview.url}
                    controls
                    className="w-full max-h-96 rounded"
                  >
                    Your browser does not support video playback.
                  </video>
                )}

                {showPreview.type === "document" && (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-muted-foreground">
                      Document preview not available.
                    </p>
                    <Button className="mt-4" asChild>
                      <a href={showPreview.url} download={showPreview.filename}>
                        <Download className="w-4 h-4 mr-2" />
                        Download File
                      </a>
                    </Button>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p>{showPreview.description}</p>
                  <p>
                    Uploaded on{" "}
                    {new Date(showPreview.uploadedAt).toLocaleString()}
                    {" • "}
                    {formatFileSize(showPreview.size)}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
