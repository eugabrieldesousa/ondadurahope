// Formulário multi-etapas moderno para índice de carência

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('carenciaForm');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.wizard-step'));
  let currentStep = 0;

  // Inicializar Flatpickr para data de nascimento
  const nascimentoInput = document.getElementById('nascimento');
  if (nascimentoInput) {
    flatpickr(nascimentoInput, {
      locale: 'pt',
      dateFormat: 'd/m/Y',
      maxDate: 'today',
      yearRange: [1920, new Date().getFullYear()],
      defaultDate: null,
      allowInput: true,
      theme: 'light'
    });
  }

  function showStep(idx) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === idx);
    });
    // Não faz rolagem automática, mantém centralizado
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      // Validação simples
      const inputs = steps[currentStep].querySelectorAll('input, select, textarea');
      for (let input of inputs) {
        if (input.hasAttribute('required') && !input.value) {
          input.classList.add('input-error');
          input.focus();
          return;
        } else {
          input.classList.remove('input-error');
        }
      }

      // Validação especial para telefone
      const telInput = steps[currentStep].querySelector('#contato');
      if (telInput) {
        const digits = telInput.value.replace(/\D/g, '');
        if (digits.length < 12 || digits.length > 13) {
          alert('Por favor, preencha o telefone completo: +XX (XX) XXXXX-XXXX');
          telInput.classList.add('input-error');
          telInput.focus();
          return;
        }
      }

      // Validação especial para CEP
      const cepInput = steps[currentStep].querySelector('#cep');
      if (cepInput) {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) {
          alert('Por favor, preencha o CEP completo!');
          cepInput.classList.add('input-error');
          cepInput.focus();
          return;
        }
      }

      currentStep++;
      showStep(currentStep);
    }
  }

  // Avançar com botão
  form.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (btn.type === 'submit') {
        form.dispatchEvent(new Event('submit'));
      } else {
        nextStep();
      }
    });
  });

  // Origem extra
  const origemSelect = form.querySelector('#origem');
  if (origemSelect) {
    origemSelect.addEventListener('change', function () {
      const extra = document.getElementById('origemExtra');
      extra.style.display = (origemSelect.value === 'OUTRO_BRASIL' || origemSelect.value === 'ESTRANGEIRO') ? 'block' : 'none';
    });
  }

  // Reiniciar formulário
  form.querySelector('.btn-restart').addEventListener('click', function () {
    form.reset();
    currentStep = 0;
    showStep(currentStep);
  });

  // Máscara telefone aprimorada (+XX (XX) XXXXX-XXXX)
  const telInput = form.querySelector('#contato');
  if (telInput) {
    telInput.addEventListener('input', function (e) {
      let v = telInput.value.replace(/\D/g, '');
      if (v.length > 13) v = v.slice(0, 13);
      
      let formatted = '';
      if (v.length > 0) {
        formatted = '+' + v.slice(0, 2);
        if (v.length > 2) formatted += ' (' + v.slice(2, 4);
        if (v.length > 4) formatted += ') ' + v.slice(4, 9);
        if (v.length > 9) formatted += '-' + v.slice(9, 13);
      }
      telInput.value = formatted;
    });
  }

  // Checkbox Estrangeiro - CPF
  const estrangeiroCheck = form.querySelector('#estrangeiroCheck');
  const cpfInput = form.querySelector('#cpf');
  const estrangeiroMotivo = form.querySelector('#estrangeiroMotivo');
  
  if (estrangeiroCheck && cpfInput && estrangeiroMotivo) {
    estrangeiroCheck.addEventListener('change', function() {
      if (this.checked) {
        cpfInput.style.display = 'none';
        cpfInput.value = '';
        cpfInput.removeAttribute('required');
        estrangeiroMotivo.style.display = 'block';
        estrangeiroMotivo.setAttribute('required', 'required');
      } else {
        cpfInput.style.display = 'block';
        cpfInput.setAttribute('required', 'required');
        estrangeiroMotivo.style.display = 'none';
        estrangeiroMotivo.value = '';
        estrangeiroMotivo.removeAttribute('required');
      }
    });
  }

  // Máscara CPF
  if (cpfInput) {
    cpfInput.addEventListener('input', function () {
      let v = cpfInput.value.replace(/\D/g, '');
      v = v.slice(0, 11);
      let formatted = '';
      if (v.length > 0) formatted += v.slice(0, 3);
      if (v.length > 3) formatted += '.' + v.slice(3, 6);
      if (v.length > 6) formatted += '.' + v.slice(6, 9);
      if (v.length > 9) formatted += '-' + v.slice(9, 11);
      cpfInput.value = formatted;
    });
  }

  // Radio buttons com campo condicional
  function setupConditionalRadio(stepSelector, radioName, detailId) {
    const step = form.querySelector(stepSelector);
    if (!step) return;
    const radios = step.querySelectorAll(`input[name="${radioName}"]`);
    const detail = step.querySelector(`#${detailId}`);
    radios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (radio.value === 'SIM') {
          detail.style.display = 'block';
        } else {
          detail.style.display = 'none';
          detail.value = '';
        }
      });
    });
  }

  // ===== LÓGICA CRIANÇAS/ADOLESCENTES =====
  const criancasRadios = form.querySelectorAll('input[name="criancas_radio"]');
  const criancasContainer = document.getElementById('criancasContainer');
  const qtdCriancasInput = document.getElementById('qtdCriancas');
  const criancasFields = document.getElementById('criancasFields');

  criancasRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'SIM') {
        criancasContainer.style.display = 'block';
        qtdCriancasInput.setAttribute('required', 'required');
      } else {
        criancasContainer.style.display = 'none';
        qtdCriancasInput.removeAttribute('required');
        qtdCriancasInput.value = '';
        criancasFields.innerHTML = '';
      }
    });
  });

  qtdCriancasInput.addEventListener('input', function() {
    const qtd = parseInt(this.value) || 0;
    criancasFields.innerHTML = '';
    
    for (let i = 1; i <= qtd; i++) {
      const fieldGroup = document.createElement('div');
      fieldGroup.className = 'crianca-group';
      fieldGroup.style.cssText = 'margin-top: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 8px; border-left: 3px solid #6B46C1;';
      
      fieldGroup.innerHTML = `
        <p style="font-weight: 600; color: #6B46C1; margin-bottom: 0.8rem;">Criança/Adolescente ${i}</p>
        <label style="display: block; margin-bottom: 0.5rem;">Nome *</label>
        <input type="text" name="crianca_nome_${i}" required placeholder="Nome completo" style="margin-bottom: 0.8rem;">
        <label style="display: block; margin-bottom: 0.5rem;">Idade *</label>
        <input type="number" name="crianca_idade_${i}" min="0" max="18" required placeholder="Idade">
      `;
      
      criancasFields.appendChild(fieldGroup);
    }
  });

  // ===== LÓGICA REDE DE APOIO =====
  const redeApoioRadios = form.querySelectorAll('input[name="rede_apoio"]');
  const redeApoioContainer = document.getElementById('redeApoioContainer');
  const redeOutrosCheck = document.getElementById('redeOutrosCheck');
  const redeOutrosTexto = document.getElementById('redeOutrosTexto');

  redeApoioRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'SIM') {
        redeApoioContainer.style.display = 'block';
      } else {
        redeApoioContainer.style.display = 'none';
        // Limpar seleções
        form.querySelectorAll('input[name="rede_apoio_tipo"]').forEach(cb => cb.checked = false);
        redeOutrosTexto.style.display = 'none';
        redeOutrosTexto.value = '';
      }
    });
  });

  if (redeOutrosCheck) {
    redeOutrosCheck.addEventListener('change', function() {
      if (this.checked) {
        redeOutrosTexto.style.display = 'block';
        redeOutrosTexto.setAttribute('required', 'required');
      } else {
        redeOutrosTexto.style.display = 'none';
        redeOutrosTexto.removeAttribute('required');
        redeOutrosTexto.value = '';
      }
    });
  }

  // ONG
  setupConditionalRadio('.wizard-step:nth-of-type(20)', 'ong_radio', 'ongDetalhe');
  // Amigo/familiar HOPE
  setupConditionalRadio('.wizard-step:nth-of-type(21)', 'amigo_hope', 'amigoDetalhe');
  // Onda Dura GP
  setupConditionalRadio('.wizard-step:nth-of-type(23)', 'ondadura_radio', 'ondaduraGP');

  // API ViaCEP
  const cepInput = form.querySelector('#cep');
  if (cepInput) {
    cepInput.addEventListener('input', function () {
      let v = cepInput.value.replace(/\D/g, '');
      v = v.slice(0, 8);
      if (v.length > 5) {
        cepInput.value = v.slice(0, 5) + '-' + v.slice(5);
      } else {
        cepInput.value = v;
      }
    });

    cepInput.addEventListener('blur', async function () {
      const cep = cepInput.value.replace(/\D/g, '');
      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            form.querySelector('#endereco').value = data.logradouro || '';
            form.querySelector('#bairro').value = data.bairro || '';
            form.querySelector('#cidade').value = data.localidade || '';
            form.querySelector('#estado').value = data.uf || '';
            form.querySelector('#numero').focus();
          } else {
            alert('CEP não encontrado!');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    });
  }

  // Botão Voltar
  form.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', function () {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // Cálculo do índice de carência
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Critérios de carência (quanto menor renda, mais filhos, menos auxílios, mais vulnerável)
    let score = 0;
    // Renda
    const renda = form.renda.value;
    if (renda === '0-1') score += 40;
    else if (renda === '1-2') score += 30;
    else if (renda === '2-3') score += 15;
    else score += 5;
    // Auxílio
    const auxilios = Array.from(form.querySelectorAll('input[name="auxilio"]:checked')).map(x => x.value);
    if (auxilios.includes('NÃO')) score += 30;
    if (auxilios.includes('BOLSA FAMÍLIA')) score += 10;
    if (auxilios.includes('BPC')) score += 10;
    if (auxilios.includes('APOSENTADORIA')) score += 5;
    // Família (simples: mais filhos, mais vulnerável)
    const familiaTxt = form.familia.value;
    const filhos = (familiaTxt.match(/filho/gi) || []).length;
    if (filhos >= 3) score += 15;
    else if (filhos === 2) score += 10;
    else if (filhos === 1) score += 5;
    // Vício
    if (form.vicio.value === 'SIM') score += 10;
    // Tempo de auxílio
    if (form.tempo.value === '4+') score += 10;
    // Atividades
    if (form.atividades.value === 'SIM') score += 5;
    // CRAS/CREAS
    const unidades = Array.from(form.querySelectorAll('input[name="unidades"]:checked')).map(x => x.value);
    if (unidades.includes('NENHUMA')) score += 10;
    // Autonomia
    if (form.autonomia.value.length < 20) score += 5;
    // Mensagem final
    let msg = '';
    let color = '';
    if (score >= 70) {
      msg = '✅ Sua família atende ao índice de carência! Já recebemos seu contato e em breve entraremos em contato.';
      color = '#6B46C1';
    } else {
      msg = '❌ Obrigado por participar, mas infelizmente sua família não atende ao índice de carência para atendimento prioritário.';
      color = '#d32f2f';
    }
    form.querySelector('#carenciaScore').innerHTML = `<span style='font-size:2.2rem;font-weight:700;color:${color}'>${score}</span> / 100`;
    form.querySelector('#carenciaMsg').innerHTML = `<span style='color:${color};font-size:1.2rem;'>${msg}</span>`;
    currentStep++;
    showStep(currentStep);
  });

  // Inicializa
  showStep(currentStep);
});
