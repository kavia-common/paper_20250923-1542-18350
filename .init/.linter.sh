#!/bin/bash
cd /home/kavia/workspace/code-generation/paper_20250923-1542-18350/ClinicalWebInterface
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

