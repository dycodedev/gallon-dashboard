<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <base href="/">
    <title>{% block pageTitle %} Home {% endblock %} | Gallon</title>
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
            {% if role.indexOf('admin') >= 0 %}
            <li>
                <a href="/users">
                    <label> User Management </label>
                </a>
            </li>
            {% endif %}
            <li>
                <a href="/signout">
                    <label> Sign Out </label>
                </a>
            </li>
        </ul>
    </header>
    {% block content %}{% endblock %}

    <script src="/jquery/dist/jquery.min.js"></script>
    <script>
        $(document).ready(function() {
            $('.glx-delete-button').on('click', function(event) {
                event.preventDefault();

                var res = confirm('Are you sure want to delete this device?');

                if (res) {
                    window.location = $(this).attr('href');
                }
            });
        });
    </script>
</body>
</html>
