"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Check } from "lucide-react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface UploadWidgetProps {
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: any) => void;
  resourceType?: 'image' | 'video';
}

const UploadWidget = ({ onUploadSuccess, onUploadError, resourceType = 'image' }: UploadWidgetProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!window.cloudinary) return;

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        console.error("Missing Cloudinary credentials");
        return;
      }

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ["local", "url"],
          multiple: false,
          maxFiles: 1,
          resourceType,
          clientAllowedFormats: resourceType === 'image' 
            ? ["jpg", "jpeg", "png", "webp"]
            : ["mp4"],
          maxFileSize: resourceType === 'image' ? 500000 : 40000000, // 500KB for images, 40MB for videos
          cropping: resourceType === 'image',
          croppingShowDimensions: resourceType === 'image',
          croppingValidateDimensions: resourceType === 'image',
          styles: {
            palette: {
              window: "#252525",
              windowBorder: "#333333",
              tabIcon: "#3B82F6",
              menuIcons: "#3B82F6",
              textDark: "#FFFFFF",
              textLight: "#FFFFFF",
              link: "#3B82F6",
              action: "#3B82F6",
              inactiveTabIcon: "#666666",
              error: "#EF4444",
              inProgress: "#3B82F6",
              complete: "#10B981",
              sourceBg: "#333333"
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            console.error("Upload error:", error);
            onUploadError?.(error);
            setIsLoading(false);
            setUploadProgress(0);
            return;
          }

          if (result) {
            switch (result.event) {
              case "progress":
                setUploadProgress(result.info.progress || 0);
                break;
              case "success":
                                                if (!result.info.secure_url || !result.info.public_id) {
                  console.error("Missing required fields in upload response:", result.info);
                  onUploadError?.("Upload response missing required fields");
                  return;
                }
                onUploadSuccess?.(result.info);
                setIsLoading(false);
                setUploadProgress(100);
                setIsComplete(true);
                break;
            }
          }
        }
      );
    };

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, [onUploadSuccess, onUploadError, resourceType]);

  const handleClick = () => {
    if (isComplete) {
      setIsComplete(false);
      setUploadProgress(0);
      return;
    }

    if (!widgetRef.current) {
      console.error("Widget not initialized");
      return;
    }
    setIsLoading(true);
    widgetRef.current.open();
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isComplete ? (
          <>
            <Check className="w-4 h-4" />
            <span>OK</span>
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>Upload {resourceType === 'image' ? 'Image' : 'Video'}</span>
          </>
        )}
      </button>
      
      {isLoading && (
        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
