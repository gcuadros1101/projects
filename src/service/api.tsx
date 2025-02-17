import e from "express";

// Note to developer: change this to dev for testing locally; switch back to prod before deploying/merging
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://g2ox05vtbb.execute-api.us-east-2.amazonaws.com/prod/v1";


type ApiResponse = {
    body: any,
    status: string
}

async function callAPI(url: string, method: string = "POST", payload: any = {}): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/${url}`, {
      method,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    let parsed_body = {};
  
    if (data.body) {
      parsed_body = JSON.parse(data.body);
      console.log("Parsed body:", parsed_body);
    }
    
    return {body: parsed_body, status: data.status};
  }

export async function fetchUserIdByPhone(phone: string) {
    // TODO: add input validation and sanitization

    const res: ApiResponse = await callAPI("whoAmI", "POST", { phone });
    if (res && res.body.userId) {
        return res.body.userId;
    }
    return null;
}

export async function fetchUserDetailsByPhone(phone: string) {
    const res: ApiResponse = await callAPI("whoAmI", "POST", { phone });
    if (res && res.body.userId) {
        return {
            userId: res.body.userId,
            genderRevealOnly: res.body.genderRevealOnly ?? false // Default to false
        };
    }
    return null;
}


export async function fetchUserEligibility(userId: string) {
    const res: ApiResponse = await callAPI("getUserEligibility", "POST", { userId });
    if (res && res.body && (typeof res.body.eligibility === "boolean")) {
        return res.body.eligibility;
    }
    console.log('An error occurred fetching user eligibility. Setting eligibility to true by default.')
    return true;
}

export async function updateUserEligibility(userId: string, eligibility: boolean) {
    const res: ApiResponse = await callAPI("updateUserEligibility", "POST", { userId, eligibility});
    if (res && res.body && res.body.status) {
        return res.body.status;
    }
    return null;
}

export async function updateRSVP(userId: string, rsvp: boolean, dietaryRestrictions?: string) {
    let res: ApiResponse;
    if (dietaryRestrictions) {
        res = await callAPI("updateRSVP", "POST", { userId, rsvp, dietaryRestrictions});
    } else {
        res = await callAPI("updateRSVP", "POST", { userId, rsvp});
    }
    if (res && res.body && res.body.status) {
        return res.body.status
    }
    return null;
}
