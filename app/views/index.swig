{% extends './template/freebase.swig' %}

{% block pageTitle %} List Devices {% endblock %}

{% block content %}
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
                <td>
                    <a href="/dashboard/{{ dev.device.id }}" class="text-button" style="margin-right: 10px"> Open Dashboard</a>
                    <a href="/devices/{{ dev._id.toString() }}/delete" class="text-button glx-delete-button">Delete</a>
                </td>
            </tr>
        {% endfor %}
        </tbody>
    </table>
</div>
{% endblock %}
