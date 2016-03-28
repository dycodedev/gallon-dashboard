{% extends './template/freebase.swig' %}

{% block pageTitle %}Add User{% endblock %}</title>

{% block content %}
<div id="board-content" style="margin-top: 30px; padding: 15px 30px">
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
</div>
{% endblock %}
