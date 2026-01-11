{{/*
Expand the name of the chart.
*/}}
{{- define "evolution-todo.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "evolution-todo.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "evolution-todo.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "evolution-todo.labels" -}}
helm.sh/chart: {{ include "evolution-todo.chart" . }}
{{ include "evolution-todo.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "evolution-todo.selectorLabels" -}}
app.kubernetes.io/name: {{ include "evolution-todo.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "evolution-todo.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "evolution-todo.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Frontend labels
*/}}
{{- define "evolution-todo.frontend.labels" -}}
{{ include "evolution-todo.labels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Frontend selector labels
*/}}
{{- define "evolution-todo.frontend.selectorLabels" -}}
{{ include "evolution-todo.selectorLabels" . }}
app: frontend
{{- end }}

{{/*
Backend labels
*/}}
{{- define "evolution-todo.backend.labels" -}}
{{ include "evolution-todo.labels" . }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Backend selector labels
*/}}
{{- define "evolution-todo.backend.selectorLabels" -}}
{{ include "evolution-todo.selectorLabels" . }}
app: backend
{{- end }}

{{/*
MCP labels
*/}}
{{- define "evolution-todo.mcp.labels" -}}
{{ include "evolution-todo.labels" . }}
app.kubernetes.io/component: mcp
{{- end }}

{{/*
MCP selector labels
*/}}
{{- define "evolution-todo.mcp.selectorLabels" -}}
{{ include "evolution-todo.selectorLabels" . }}
app: mcp
{{- end }}

{{/*
PostgreSQL labels
*/}}
{{- define "evolution-todo.postgresql.labels" -}}
{{ include "evolution-todo.labels" . }}
app.kubernetes.io/component: database
{{- end }}

{{/*
PostgreSQL selector labels
*/}}
{{- define "evolution-todo.postgresql.selectorLabels" -}}
{{ include "evolution-todo.selectorLabels" . }}
app: postgres
{{- end }}
