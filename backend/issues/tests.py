

# Create your tests here.
from django.test import TestCase
from .models import Issue,Category

class IssueTest(TestCase):

    def test_create_issue(self):
    	category=Category.objects.create(
    		name="Water"
    		)
    	issue = Issue.objects.create(
    		title="Water Problem",
    		description="No water supply",
    		latitude=17.3850,
    		longitude=78.4867,
    		category=category
    		)
    	self.assertEqual(issue.title, "Water Problem")
