## Installation

### Prerequisites
- Bitbucket Access to this repository and all sub-modules
- A ssh-keypair
- Public ssh key added to BitBucket
- [git]()
- [node]()

1. Create a parent folder to house the project and `cd`
```bash
mkdir affiniti-network-assure
cd affiniti-network-assure
```

2. Copy init.sh in the "affiniti-network-assure" directory and execute it
```bash
./init.sh
```

3. After the init process completes, you should have ana-main, ana-security and ana-web-client directories.

4. Start the applications

To start both API and Client (at the same time):
```
cd ./ana-main
npm run start
```

To start the API:
```
cd ./ana-main/ana-security
npm run start
```

To start the Client:
```
cd ./ana-main/ana-web-client
npm run start
```