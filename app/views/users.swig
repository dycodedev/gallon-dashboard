{% extends './template/freebase.swig' %}

{% block pageTitle %} List Users {% endblock %}

{% block content %}
<div id="board-content" style="margin-top: 30px; padding: 15px 30px">
    <h2> Users </h2>
    <table class="table">
        <thead>
            <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created Time</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
        {% for user in users %}
            <tr>
                <td>{{ user.fullname }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.ts.toLocaleString() }}</td>
                <td>
                    <a href="/users/{{ user._id.toString() }}/delete" class="text-button glx-delete-button">Delete</a>
                </td>
            </tr>
        {% endfor %}
        </tbody>
    </table>
</div>
{% endblock %}
