import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';
import React from 'react';
import { Button } from './button';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof Progress>;

// Basic Progress
export const Basic: Story = {
  render: () => <Progress value={33} className="w-[60%]" />,
};

// Determinate Progress
export const Determinate: Story = {
  render: () => (
    <div className="w-[60%] space-y-4">
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
};

// Loading Progress
export const Loading: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(13);

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);

      return () => {
        clearInterval(timer);
      };
    }, []);

    return <Progress value={progress} className="w-[60%]" />;
  },
};

// Download Progress
export const DownloadProgress: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);
    const [isDownloading, setIsDownloading] = React.useState(false);

    React.useEffect(() => {
      if (isDownloading) {
        const timer = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              setIsDownloading(false);
              return 100;
            }
            const diff = Math.random() * 10;
            return Math.min(oldProgress + diff, 100);
          });
        }, 500);

        return () => {
          clearInterval(timer);
        };
      }
    }, [isDownloading]);

    return (
      <div className="w-[300px] space-y-4">
        <div className="flex justify-between text-sm">
          <div>Downloading file...</div>
          <div>{Math.round(progress)}%</div>
        </div>
        <Progress value={progress} />
        <Button
          onClick={() => {
            setProgress(0);
            setIsDownloading(true);
          }}
          disabled={isDownloading}
        >
          {progress === 100 ? "Download Complete" : isDownloading ? "Downloading..." : "Start Download"}
        </Button>
      </div>
    );
  },
};

// Custom Styled
export const CustomStyled: Story = {
  render: () => (
    <div className="w-[60%] space-y-4">
      <Progress 
        value={65} 
        className="bg-blue-100 [&>[role=progressbar]]:bg-blue-500" 
      />
      <Progress 
        value={75} 
        className="bg-green-100 [&>[role=progressbar]]:bg-green-500" 
      />
      <Progress 
        value={85} 
        className="bg-purple-100 [&>[role=progressbar]]:bg-purple-500" 
      />
      <Progress 
        value={45} 
        className="h-6 bg-orange-100 [&>[role=progressbar]]:bg-orange-500" 
      />
    </div>
  ),
};

// Upload Progress with Status
export const UploadProgress: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);
    const [status, setStatus] = React.useState<'idle' | 'uploading' | 'complete' | 'error'>('idle');

    const startUpload = () => {
      setStatus('uploading');
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            setStatus('complete');
            return 100;
          }
          return Math.min(oldProgress + Math.random() * 10, 100);
        });
      }, 500);
    };

    return (
      <div className="w-[300px] space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            {status === 'idle' && 'Ready to upload'}
            {status === 'uploading' && 'Uploading...'}
            {status === 'complete' && 'Upload complete!'}
            {status === 'error' && 'Upload failed'}
          </div>
          <div>{Math.round(progress)}%</div>
        </div>
        <Progress 
          value={progress} 
          className={
            status === 'error' 
              ? 'bg-red-100 [&>[role=progressbar]]:bg-red-500'
              : status === 'complete'
              ? 'bg-green-100 [&>[role=progressbar]]:bg-green-500'
              : undefined
          }
        />
        <div className="flex gap-2">
          <Button
            onClick={startUpload}
            disabled={status === 'uploading'}
            className="flex-1"
          >
            {status === 'complete' ? 'Upload Another' : 'Start Upload'}
          </Button>
          {status === 'uploading' && (
            <Button 
              variant="destructive"
              onClick={() => {
                setStatus('error');
                setProgress(66);
              }}
            >
              Simulate Error
            </Button>
          )}
        </div>
      </div>
    );
  },
}; 