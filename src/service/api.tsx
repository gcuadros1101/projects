import e from "express";

const API_BASE_URL = "https://g2ox05vtbb.execute-api.us-east-2.amazonaws.com/prod/v1";


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


export async function fetchUserEligibility(userId: string) {
    const res: ApiResponse = await callAPI("getUserEligibility", "POST", { userId });
    if (res && res.body && res.body.eligibility) {
        return res.body.eligibility;
    }
    return null;
}

export async function updateUserEligibility(userId: string, eligibility: boolean) {
    const res: ApiResponse = await callAPI("updateUserEligibility", "POST", { userId, eligibility});
    if (res && res.body && res.body.status) {
        return res.body.status;
    }
    return null;
}

export async function updateRSVP(userId: string, rsvp: boolean) {
    const res: ApiResponse = await callAPI("updateRSVP", "POST", { userId, rsvp});
    if (res && res.body && res.body.status) {
        return res.body.status;
    }
    return null;
}
