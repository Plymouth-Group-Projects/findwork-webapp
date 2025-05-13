import { IJob } from "@/models/job";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface JobsResponse {
  success: boolean;
  jobs: IJob[];
  pagination: PaginationData;
  error?: string;
}

interface JobResponse {
  success: boolean;
  job: IJob;
  error?: string;
}

// Function to fetch all jobs with filtering
export async function fetchJobs(filters: Record<string, string> = {}): Promise<JobsResponse> {
  try {
    // Construct URL with query parameters
    const url = new URL('/api/job-hub', window.location.origin);
    
    // Add filters as query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
    
    // Fetch the data
    const response = await fetch(url.toString());
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch jobs');
    }
    
    // Return the data
    return await response.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return {
      success: false,
      jobs: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Function to fetch a single job by ID
export async function fetchJobById(jobId: string): Promise<JobResponse> {
  try {
    // Fetch the data
    const response = await fetch(`/api/job-hub/${jobId}`);
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch job');
    }
    
    // Return the data
    return await response.json();
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    return {
      success: false,
      job: {} as IJob,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Function to create a new job
export async function createJob(jobData: Partial<IJob>): Promise<JobResponse> {
  try {
    // Send POST request
    const response = await fetch('/api/job-hub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create job');
    }
    
    // Return the data
    return await response.json();
  } catch (error) {
    console.error('Error creating job:', error);
    return {
      success: false,
      job: {} as IJob,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Function to update an existing job
export async function updateJob(jobId: string, jobData: Partial<IJob>): Promise<JobResponse> {
  try {
    // Send PATCH request
    const response = await fetch(`/api/job-hub/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update job');
    }
    
    // Return the data
    return await response.json();
  } catch (error) {
    console.error(`Error updating job ${jobId}:`, error);
    return {
      success: false,
      job: {} as IJob,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Function to delete a job
export async function deleteJob(jobId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Send DELETE request
    const response = await fetch(`/api/job-hub/${jobId}`, {
      method: 'DELETE',
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete job');
    }
    
    // Return the data
    return await response.json();
  } catch (error) {
    console.error(`Error deleting job ${jobId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
