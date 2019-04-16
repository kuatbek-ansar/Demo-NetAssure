export class Message {
    public Id: string;

    public Destination: string;

    public Subject: string;

    public Body: string;

    public Medium: string;

    constructor(medium?: string, subject?: string, destination?: string, body?: string) {
        this.Medium = medium || '';
        this.Subject = subject || '';
        this.Destination = destination || '';
        this.Body = body || '';
    }
}
