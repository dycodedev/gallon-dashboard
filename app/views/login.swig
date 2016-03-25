<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sign In | Gallon</title>
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content = "width = device-width, initial-scale = 1, user-scalable = no" />
    <link href="css/freeboard.min.css" rel="stylesheet" />
    <style>
        body { margin: 0; padding: 0; }

        .form-wrapper {
            margin: 12.5% auto !important;
            width: 640px;
        }

        .form-wrapper input[type="submit"],
        .form-wrapper input[type="reset"] {
            background: none;
            border: none;
        }
    </style>
</head>
<body>
    <div class="form-wrapper">
        <form method="POST" action="">
            <div class="form-row">
                <div class="form-label">
                    <label class="control-label">Username</label>
                </div>
                <div class="form-value">
                    <input type="text" name="username" placeholder="Username">
                </div>
            </div>

            <div class="form-row">
                <div class="form-label">
                    <label class="control-label">Password</label>
                </div>
                <div class="form-value">
                    <input type="password" name="password" placeholder="Password">
                </div>
            </div>

            <div class="form-row">
                <div class="form-label">
                    <label class="control-label"></label>
                </div>

                <div class="form-value">
                    <input type="reset" class="text-button" value="Clear">
                    <input type="submit" class="text-button" value="Sign In">
                </div>
            </div>
        </form>
    </div>
</body>
</html>
