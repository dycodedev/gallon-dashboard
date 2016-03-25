<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>List Devices | Gallon</title>
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content = "width = device-width, initial-scale = 1, user-scalable = no" />
    <link href="css/freeboard.min.css" rel="stylesheet" />
    <style>
    .board-toolbar > li > a:hover {
        color: #B88F51;
    }
    </style>
</head>
<body>
    <header id="main-header" style="display: block; top: 0px">
        <ul class="board-toolbar horizontal" style="float: right; margin: 10px;">
            <li>
                <a href="/signout">
                    <label> Sign Out </label>
                </a>
            </li>
        </ul>
    </header>

    <div id="board-content" style="margin-top: 30px; padding: 15px 30px">
        <h2> Your Devices </h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Device ID</th>
                    <th>Device Name</th>
                    <th>Water Level</th>
                    <th>LDR Value</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {% for dev in devices %}
                <tr>
                    <td>{{ dev.device.id }}</td>
                    <td>{{ dev.device.name }}</td>
                    <td>{{ dev.attr.waterLevelPercent }}%</td>
                    <td>{% if dev.attr.ldr === 1 %} On {% else %} Off {% endif %}</td>
                    <td><a href="/dashboard/{{ dev.device.id }}"> Open Dashboard</a></td>
                </tr>
            {% endfor %}
            </tbody>
        </table>
    </div>
</body>
</html>
