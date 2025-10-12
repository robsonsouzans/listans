import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('verificar_login_lc', {
        email_input: loginForm.email,
        senha_input: loginForm.password
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const user = data[0];
        // Normalizar e salvar dados do usuário no localStorage
        const sessionUser = {
          usuario_id: user.usuario_id,
          nome: user.nome,
          email: user.email,
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a), ${user.nome}!`,
        });
        navigate('/');
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('cadastrar_usuario_lc', {
        nome_input: signupForm.name,
        email_input: signupForm.email,
        senha_input: signupForm.password,
      });

      if (error) {
        if (error.message?.includes('EMAIL_JA_EXISTE') || error.code === '23505') {
          toast({
            title: "Erro no cadastro",
            description: "Este email já está em uso.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      const user = data?.[0];
      if (!user) throw new Error('Cadastro não retornou usuário');

      const sessionUser = {
        usuario_id: user.usuario_id,
        nome: user.nome,
        email: user.email,
      };
      localStorage.setItem('currentUser', JSON.stringify(sessionUser));

      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo(a), ${user.nome}!`,
      });

      navigate('/');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gaming image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHN0eWxlPgouY2xzLTF7ZmlsbDojMjEyOTM3O30KLmNscy0ye2ZpbGw6IzM3NEE2Qjt9Ci5jbHMtM3tmaWxsOiM0NDU0NzE7fQouY2xzLTR7ZmlsbDojNTY2QTg1O30KLmNscy01e2ZpbGw6IzY4N0FCQjt9Ci5jbHMtNntmaWxsOiM3QzhDRjU7fQo8L3N0eWxlPgo8L2RlZnM+CjxyZWN0IGNsYXNzPSJjbHMtMSIgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIvPgo8cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMCwwIDE5MjAsMCAxOTIwLDU0MCA5NjAsNTQwIDAsNTQwIi8+Cjxwb2x5Z29uIGNsYXNzPSJjbHMtMyIgcG9pbnRzPSIwLDU0MCA5NjAsNTQwIDE5MjAsNTQwIDE5MjAsMTA4MCA5NjAsMTA4MCA0ODAsMTA4MCA0ODAsMTA4MCAyNDAsMTA4MCA5NiwxMDgwIDAsNTQwIi8+CjxjaXJjbGUgY2xhc3M9ImNscy00IiBjeD0iNDgwIiBjeT0iMjcwIiByPSIxMjAiLz4KPGNpcmNsZSBjbGFzcz0iY2xzLTUiIGN4PSIxNDQwIiBjeT0iODEwIiByPSI5MCIvPgo8Y2lyY2xlIGNsYXNzPSJjbHMtNiIgY3g9IjE0NDAiIGN5PSI4MTAiIHI9IjQwIi8+CjxjaXJjbGUgY2xhc3M9ImNscy01IiBjeD0iMjQwIiBjeT0iODEwIiByPSI2MCIvPgo8L3N2Zz4=')`
        }}
      />
      
      {/* Purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-purple-800/90" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Title and subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">Lista de Compras</h1>
            <p className="text-purple-200 text-lg">Organize suas compras de forma inteligente</p>
            <p className="text-purple-300/80 text-sm mt-1">[Pressione Enter para começar a organizar]</p>
          </div>

          <Card className="bg-black/40 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
            <CardContent className="p-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/30 border border-purple-500/30">
                  <TabsTrigger 
                    value="login" 
                    className="text-purple-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="text-purple-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 z-10" />
                        <Input
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          placeholder="Email address"
                          required
                          disabled={isLoading}
                          className="pl-11 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 z-10" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          placeholder="Password"
                          required
                          disabled={isLoading}
                          className="pl-11 pr-11 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-purple-400 hover:text-purple-300"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setRememberMe(!rememberMe)}
                          className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors"
                        >
                          <div className={`w-4 h-4 rounded border ${rememberMe ? 'bg-purple-600 border-purple-600' : 'border-purple-400'} flex items-center justify-center`}>
                            {rememberMe && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm">Remember me</span>
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="text-purple-300 hover:text-purple-200 p-0 h-auto text-sm"
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>

                    <div className="text-center">
                      <p className="text-purple-300 text-sm mb-4">quick access via</p>
                      <div className="flex justify-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-400/50">
                          ⚔️
                        </Button>
                        <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-400/50">
                          🎮
                        </Button>
                        <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-400/50">
                          🏆
                        </Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 z-10" />
                        <Input
                          type="text"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          placeholder="Nome completo"
                          required
                          disabled={isLoading}
                          className="pl-11 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 z-10" />
                        <Input
                          type="email"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          placeholder="Email address"
                          required
                          disabled={isLoading}
                          className="pl-11 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 z-10" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          placeholder="Password (min. 6 caracteres)"
                          required
                          disabled={isLoading}
                          minLength={6}
                          className="pl-11 pr-11 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-purple-400 hover:text-purple-300"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 z-10" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                          placeholder="Confirm password"
                          required
                          disabled={isLoading}
                          className="pl-11 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Cadastrando..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Don't have account link for login tab */}
              <div className="text-center mt-6">
                <p className="text-purple-300 text-sm">
                  Não tem uma conta?{' '}
                  <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto text-sm">
                    Create Account
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;