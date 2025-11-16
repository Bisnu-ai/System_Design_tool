
    const canvas = document.getElementById('diagramCanvas');
    const ctx = canvas.getContext('2d');

    let boxes = [];
    let connections = [];
    let isDragging = false;
    let draggedBox = null;
    let offsetX, offsetY;
    let isConnecting = false;
    let connectionStart = null;

    function generateDiagram() {
        const instructions = document.getElementById('instructions').value.toLowerCase();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        boxes = [];
        connections = [];

        if (instructions.includes('whatsapp')) {
            drawWhatsAppDiagram();
        } else if (instructions.includes('facebook')) {
            drawFacebookDiagram();
        } else {
            ctx.font = '20px Poppins';
            ctx.fillText(' Unsupported system. Try "WhatsApp" or "Facebook".', 20, 40);
        }
    }

    function drawBox(x, y, width, height, text) {
        ctx.strokeStyle = "#6c5ce7";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.font = '15px Poppins';
        ctx.fillStyle = "#444";
        ctx.fillText(text, x + 10, y + 28);
        boxes.push({x, y, width, height, text});
    }

    function drawArrow(fromX, fromY, toX, toY) {
        ctx.strokeStyle = "#4e42d4";
        ctx.fillStyle = "#4e42d4";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 12 * Math.cos(angle - Math.PI / 6), toY - 12 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - 12 * Math.cos(angle + Math.PI / 6), toY - 12 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    function drawWhatsAppDiagram() {
        drawBox(80, 80, 150, 60, "User Interface");
        drawBox(350, 80, 150, 60, "Chat Server");
        drawBox(620, 80, 150, 60, "Database");
        drawBox(350, 250, 150, 60, "Media Server");

        connections = [
            {from: boxes[0], to: boxes[1]},
            {from: boxes[1], to: boxes[2]},
            {from: boxes[1], to: boxes[3]}
        ];

        redrawDiagram();
        ctx.font = '18px Poppins';
        ctx.fillText('WhatsApp System Design', 350, 40);
    }

    function drawFacebookDiagram() {
        drawBox(80, 80, 150, 60, "User Interface");
        drawBox(350, 80, 150, 60, "Web Server");
        drawBox(620, 80, 150, 60, "User Database");
        drawBox(200, 250, 150, 60, "News Feed");
        drawBox(500, 250, 150, 60, "Media Storage");

        connections = [
            {from: boxes[0], to: boxes[1]},
            {from: boxes[1], to: boxes[2]},
            {from: boxes[1], to: boxes[3]},
            {from: boxes[1], to: boxes[4]}
        ];

        redrawDiagram();
        ctx.font = '18px Poppins';
        ctx.fillText('Facebook System Design', 340, 40);
    }

    function redrawDiagram() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        boxes.forEach(box => {
            ctx.strokeStyle = "#6c5ce7";
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            ctx.font = '15px Poppins';
            ctx.fillStyle = "#444";
            ctx.fillText(box.text, box.x + 10, box.y + 28);
        });

        connections.forEach(conn => {
            drawArrow(
                conn.from.x + conn.from.width / 2,
                conn.from.y + conn.from.height / 2,
                conn.to.x + conn.to.width / 2,
                conn.to.y + conn.to.height / 2
            );
        });
    }

    function addNewBox() {
        const text = document.getElementById('newBoxText').value;
        if (text) {
            drawBox(80, 80, 150, 60, text);
            redrawDiagram();
            document.getElementById('newBoxText').value = '';
        }
    }

    function toggleConnectionMode() {
        isConnecting = !isConnecting;
        connectionStart = null;
    }

    canvas.addEventListener('mousedown', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        boxes.forEach(box => {
            if (mouseX >= box.x && mouseX <= box.x + box.width &&
                mouseY >= box.y && mouseY <= box.y + box.height) {
                
                if (isConnecting) {
                    if (!connectionStart) {
                        connectionStart = box;
                    } else {
                        connections.push({from: connectionStart, to: box});
                        connectionStart = null;
                        redrawDiagram();
                    }
                } else {
                    isDragging = true;
                    draggedBox = box;
                    offsetX = mouseX - box.x;
                    offsetY = mouseY - box.y;
                }
            }
        });
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            draggedBox.x = mouseX - offsetX;
            draggedBox.y = mouseY - offsetY;

            redrawDiagram();
        }
    });

    canvas.addEventListener('mouseup', function() {
        isDragging = false;
        draggedBox = null;
    });

    canvas.addEventListener('mouseleave', function() {
        isDragging = false;
        draggedBox = null;
    });

