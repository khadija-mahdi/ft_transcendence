from rest_framework import serializers
from user.models import User

class InputSerializer(serializers.Serializer):
    code = serializers.CharField(required=False)
    error = serializers.CharField(required=False)

class GoogleUserSerializer(serializers.ModelSerializer):
    
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['image_url', 'first_name', 'last_name', 'email', 'username']

    def get_username(self, obj):    
        return obj.get('email').split('@')[0]

    def save(self, *args, **kwargs):
        print(self.initial_data)
        self.validated_data['registration_method'] = 'google'
        self.validated_data['image_url'] = self.initial_data.get('picture', '')
        self.validated_data['username'] = self.get_username(self.validated_data)
        self.validated_data['first_name'] = self.initial_data.get('given_name', '')
        self.validated_data['last_name'] = self.initial_data.get('family_name', '')
        return super().save(**kwargs)


class IntraUserSerializer(serializers.ModelSerializer):
    
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['image_url', 'first_name', 'last_name', 'email', 'username']

    def get_username(self, obj):    
        return obj.get('login')

    def save(self, *args, **kwargs):
        print(self.initial_data)
        self.validated_data['registration_method'] = 'intra'
        self.validated_data['username'] = self.get_username(self.initial_data)
        self.validated_data['image_url'] = self.initial_data.get('image', '').get('versions').get('medium')
        self.validated_data['first_name'] = self.initial_data.get('displayname', '').split(' ')[0]
        self.validated_data['last_name'] = self.initial_data.get('displayname', '').split(' ')[1]
        return super().save(**kwargs)
